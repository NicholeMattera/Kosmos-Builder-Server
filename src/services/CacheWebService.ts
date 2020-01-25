// Kosmos Builder Server
// Copyright (C) 2020 Nichole Mattera
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

import { Headers } from 'request'
import request from 'request-promise-native'
import Config from '../config.json'
import ICache from '../types/Cache'
import { IGitHubRelease } from '../types/GitHub'
import { IGitLabRelease } from '../types/GitLab'
import IRelease from '../types/Release'
import Service from '../types/Service'

class CacheWebService {
    public static async getLatestGitHubRelease(
        user: string,
        project: string,
        pattern: RegExp,
        includePrerelease: boolean,
    ): Promise<IRelease> {
        let release = this.checkForCache(Service.GitHub, user, project, includePrerelease)
        if (release === null) {
            try {
                const login = (Config.gitHub.authenticate) ? `${Config.gitHub.username}:${Config.gitHub.password}@` : ''
                const url = `https://${login}api.github.com/repos/${encodeURI(user)}/${encodeURI(project)}/releases`
                const response = JSON.parse(
                    await request({
                        headers: {
                            'User-Agent': `Kosmos-Builder-Server/${process.env.npm_package_version}`,
                        },
                        url,
                    }),
                ) as IGitHubRelease[]
                const latestRelease = response.find((r) => {
                    return (includePrerelease && r.prerelease) || !r.prerelease
                })

                if (latestRelease !== undefined) {
                    release = {
                        assets: latestRelease.assets,
                        version: latestRelease.tag_name,
                    }

                    this.cacheRelease(Service.GitHub, user, project, release, includePrerelease)
                }
            } catch (e) {
                console.error(`Download Error: ${e}`)
                return Promise.reject('Download Error')
            }
        }

        const matchedAsset = release.assets.find((asset) => {
            return asset.name.match(pattern) !== null
        })

        if (matchedAsset === undefined) {
            return Promise.reject('Not Found')
        }

        release = {
            downloadUrl: matchedAsset.browser_download_url,
            version: release.version,
        }

        return Promise.resolve(release)
    }

    public static async getLatestGitLabRelease(
        user: string,
        project: string,
        pattern: RegExp,
        match: number,
    ): Promise<IRelease> {
        let release = this.checkForCache(Service.GitLab, user, project, false)
        if (release === null) {
            try {
                const url = `https://gitlab.com/api/v4/projects/${encodeURIComponent(`${user}/${project}`)}/releases`
                const headers: Headers = {
                    'User-Agent': `Kosmos-Builder-Server/${process.env.npm_package_version}`,
                }
                if (Config.gitLab.authenticate) {
                    headers.Authorization = `Bearer ${Config.gitLab.privateAccessToken}`
                }
                const response = JSON.parse(
                    await request({
                        headers,
                        url,
                    }),
                ) as IGitLabRelease[]

                if (response.length !== 0 && response[0].description) {
                    release = {
                        description: response[0].description,
                        version: response[0].tag_name,
                    }

                    this.cacheRelease(Service.GitLab, user, project, release, false)
                }
            } catch (e) {
                console.error(`Download Error: ${e}`)
                return Promise.reject('Download Error')
            }
        }

        const matches = release.description.match(pattern)
        if (matches == null || matches.length <= match) {
            return Promise.reject('Not Found')
        }

        release.downloadUrl = matches[match]
        return Promise.resolve(release)
    }

    public static clearCache() {
        this.cache = []
    }

    public static clearCacheForSpecificProject(
        service: Service,
        user: string,
        project: string,
    ) {
        this.cache = this.cache.filter((obj) =>
            obj.service !== service &&
            obj.user !== user &&
            obj.project !== project,
        )
    }

    private static cache: ICache[] = []

    private static cleanCache() {
        // Remove expired cached objects.
        const now = new Date()
        this.cache = this.cache.filter((obj) => obj.expiration > now)
    }

    private static checkForCache(
        service: Service,
        user: string,
        project: string,
        includedPrerelease: boolean,
    ): IRelease | null {
        this.cleanCache()

        // Try to get the cached release.
        const cachedObj = this.cache.find((obj) =>
            obj.service === service &&
            obj.user === user &&
            obj.project === project &&
            obj.includedPrerelease === includedPrerelease,
        )
        return (cachedObj === undefined) ? null : cachedObj.release
    }

    private static cacheRelease(
        service: Service,
        user: string,
        project: string,
        release: IRelease,
        includedPrerelease: boolean,
    ) {
        this.cleanCache()

        const expiration = new Date()
        expiration.setHours( expiration.getHours() + 1)
        this.cache.push({
            expiration,
            includedPrerelease,
            project,
            release,
            service,
            user,
        })
    }
}

export default CacheWebService

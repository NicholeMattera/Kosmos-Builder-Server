// Kosmos Builder Server
// Copyright (C) 2019 Nichole Mattera
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

import request from 'request-promise-native'
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
    ): Promise<IRelease> {
        let release = this.checkForCache(Service.GitHub, user, project)
        if (release === null) {
            try {
                let response = await request({
                    headers: {
                        'User-Agent': `Kosmos-Builder-Server/${process.env.npm_package_version}`,
                    },
                    url: `https://api.github.com/repos/${encodeURI(user)}/${encodeURI(project)}/releases/latest`,
                })
                response = JSON.parse(response) as IGitHubRelease

                if (
                    response.assets &&
                    response.assets.length !== 0 &&
                    response.tag_name
                ) {
                    release = {
                        assets: response.assets,
                        version: response.tag_name,
                    }

                    this.cacheRelease(Service.GitHub, user, project, release)
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
        let release = this.checkForCache(Service.GitLab, user, project)
        if (release === null) {
            try {
                const url = `https://gitlab.com/api/v4/projects/${encodeURIComponent(`${user}/${project}`)}/releases`
                let response = await request(url)
                response = JSON.parse(response) as IGitLabRelease[]

                if (response.length !== 0 && response[0].description) {
                    release = {
                        description: response[0].description,
                        version: response[0].tag_name,
                    }

                    this.cacheRelease(Service.GitLab, user, project, release)
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

    private static cache: ICache[] = []

    private static cleanCache() {
        // Remove expired cached objects.
        const now = new Date()
        this.cache = this.cache.filter((obj) => obj.expiration > now)
    }

    private static checkForCache(service: Service, user: string, project: string): IRelease | null {
        this.cleanCache()

        // Try to get the cached release.
        const cachedObj = this.cache.find((obj) =>
            obj.service === service && obj.user === user && obj.project === project,
        )
        return (cachedObj === undefined) ? null : cachedObj.release
    }

    private static cacheRelease(service: Service, user: string, project: string, release: IRelease) {
        this.cleanCache()

        const expiration = new Date()
        expiration.setHours( expiration.getHours() + 1)
        this.cache.push({
            expiration,
            project,
            release,
            service,
            user,
        })
    }
}

export default CacheWebService

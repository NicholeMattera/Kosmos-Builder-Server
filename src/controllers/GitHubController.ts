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

import express from 'express'
import CacheWebService from '../services/CacheWebService'
import Method from '../types/Method'
import BaseController from './BaseController'

class GitHubController extends BaseController {
    constructor() {
        super()
        this.path = '/github/:user/:project'
        this.initRoutes([
            {
                callback: this.getVersion,
                method: Method.GET,
                path: '/version',
            },
            {
                callback: this.getRelease,
                method: Method.GET,
                path: '/release',
            },
        ])
    }

    private async getVersion(req: express.Request, res: express.Response) {
        try {
            const release = await CacheWebService.getLatestGitHubRelease(
                req.params.user,
                req.params.project,
                req.query.pattern,
                req.query.prerelease === 'true',
            )
            res.status(200)
            res.send(release.version)
        } catch (e) {
            if (e === 'Not Found') {
                res.status(404)
                res.send()
            } else {
                res.status(500)
                res.send()
            }
        }
    }

    private async getRelease(req: express.Request, res: express.Response) {
        try {
            const release = await CacheWebService.getLatestGitHubRelease(
                req.params.user,
                req.params.project,
                req.query.pattern,
                req.query.prerelease === 'true',
            )
            res.status(200)
            res.send(release.downloadUrl)
        } catch (e) {
            if (e === 'Not Found') {
                res.status(404)
                res.send()
            } else {
                res.status(500)
                res.send()
            }
        }
    }
}

export default GitHubController

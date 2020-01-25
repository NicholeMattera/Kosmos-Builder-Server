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

import crypto from 'crypto'
import express from 'express'
import Config from '../config.json'
import CacheWebService from '../services/CacheWebService'
import { IGitHubWebhook } from '../types/GitHub'
import Method from '../types/Method'
import Service from '../types/Service'
import BaseController from './BaseController'

class UpdateController extends BaseController {
    constructor() {
        super()
        this.path = '/update'
        this.initRoutes([
            {
                callback: this.postRepoUpdate,
                method: Method.POST,
                path: '',
            },
        ])
    }

    private async postRepoUpdate(req: express.Request, res: express.Response) {
        const hmac = crypto.createHmac('sha1', Config.gitHub.secret)
        hmac.update(req.body)

        const calculatedSignature = `sha1=${ hmac.digest('hex') }`
        if (req.headers['x-hub-signature'] as string !== calculatedSignature) {
            res.sendStatus(401)
            return
        }

        if (req.headers['x-github-event'] as string !== 'release') {
            res.sendStatus(202)
            return
        }

        const reqBodyObj = JSON.parse(req.body) as IGitHubWebhook
        CacheWebService.clearCacheForSpecificProject(
            Service.GitHub,
            reqBodyObj.repository.owner.login,
            reqBodyObj.repository.name,
        )

        res.sendStatus(200)
    }
}

export default UpdateController

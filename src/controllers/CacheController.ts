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

import express from 'express'
import Config from '../config.json'
import CacheWebService from '../services/CacheWebService'
import Method from '../types/Method'
import BaseController from './BaseController'

class CacheController extends BaseController {
    constructor() {
        super()
        this.path = '/cache'
        this.initRoutes([
            {
                callback: this.deleteCache,
                method: Method.DELETE,
                path: '',
            },
        ])
    }

    private async deleteCache(req: express.Request, res: express.Response) {
        if (req.body === Config.secretKey) {
            CacheWebService.clearCache()
            res.status(200)
        } else {
            res.status(401)
        }
        res.send()
    }
}

export default CacheController

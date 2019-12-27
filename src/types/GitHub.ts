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

export interface IGitHubAuthor {
    avatar_url: string
    events_url: string
    followers_url: string
    following_url: string
    gists_url: string
    gravater_id: string
    html_url: string
    id: number
    login: string
    node_id: string
    organizations_url: string
    received_events_url: string
    repos_url: string
    site_admin: boolean
    starred_url: string
    subscriptions_url: string
    type: string
    url: string
}

export interface IGitHubAsset {
    browser_download_url: string
    content_type: string
    created_at: string
    download_count: number
    id: number
    label?: string
    name: string
    node_id: string
    url: string
    updated_at: string
    uploader: IGitHubAuthor
    size: number
    state: string
}

export interface IGitHubRelease {
    author: IGitHubAuthor
    assets: IGitHubAsset[]
    assets_url: string
    body: string
    created_at: string
    draft: boolean
    html_url: string
    id: number
    name: string
    node_id: string
    prerelease: boolean
    published_at: string
    tag_name: string
    tarball_url: string
    target_commitish: string
    upload_url: string
    url: string
    zipball_url: string
}

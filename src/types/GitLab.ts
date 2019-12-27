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

export interface IGitLabAuthor {
    avatar_url: string
    id: number
    name: string
    state: string
    username: string
    web_url: string
}

export interface IGitHubCommit {
    author_email: string
    author_name: string
    authored_date: string
    committer_date: string
    committer_email: string
    committer_name: string
    created_at: string
    id: string
    message: string
    parent_ids: string[]
    short_id: string
    title: string
}

export interface IGitLabSources {
    format: string
    url: string
}

export interface IGitLabLinks {
    id: number
    external: boolean
    name: string
    url: string
}

export interface IGitLabAssets {
    count: number
    evidence_file_path: string
    links: IGitLabLinks[]
    sources: IGitLabSources[]
}

export interface IGitLabRelease {
    name: string
    tag_name: string
    description: string
    description_html: string
    created_at: string
    released_at: string
    author: IGitLabAuthor
    commit: IGitHubCommit
    upcoming_release: boolean
    commit_path: string
    tag_path: string
    evidence_sha: string
    assets: IGitLabAssets
}

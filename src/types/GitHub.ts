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

export interface IGitHubRepository {
    id: number
    node_id: string
    name: string
    full_name: string
    private: boolean
    owner: IGitHubAuthor
    html_for: string
    description: string
    fork: boolean
    url: string
    forks_url: string
    keys_url: string
    collaborators_url: string
    teams_url: string
    hooks_url: string
    issue_events_url: string
    events_url: string
    assignees_url: string
    branches_url: string
    tags_url: string
    blobs_url: string
    git_tags_url: string
    git_refs_url: string
    trees_url: string
    statuses_url: string
    languages_url: string
    stargazers_url: string
    contributors_url: string
    subscribers_url: string
    subscription_url: string
    commits_url: string
    git_commits_url: string
    comments_url: string
    issue_comment_url: string
    contents_url: string
    compare_url: string
    merges_url: string
    archive_url: string
    downloads_url: string
    issues_url: string
    pulls_url: string
    milestones_url: string
    notifications_url: string
    labels_url: string
    releases_url: string
    deployments_url: string
    created_at: string
    updated_at: string
    pushed_at: string
    git_url: string
    ssh_url: string
    clone_url: string
    svn_url: string
    homepage: string
    size: number
    stargazers_count: number
    watchers_count: number
    language: string
    has_issues: boolean
    has_projects: boolean
    has_downloads: boolean
    has_wiki: boolean
    has_pages: boolean
    forks_count: number
    mirror_url: string
    archived: boolean
    disabled: boolean
    open_issues_count: number
    license: string
    forks: number
    open_issues: number
    watchers: number
    default_branch: string
}

export interface IGitHubWebhook {
    action: string
    release: IGitHubRelease
    repository: IGitHubRepository
    sender: IGitHubAuthor
}

export interface JiraUser {
    self: string
    accountId: string
    emailAddress: string
    avatarUrls: {
        [key: string]: string
    }
    displayName: string
    active: boolean
    timeZone: string
    accountType: string
}

export interface JiraDocContent {
    type: string
    text?: string
    content?: JiraDocContent[]
}

export interface JiraDoc {
    type: string
    version: number
    content: JiraDocContent[]
}

export interface JiraComment {
    self: string
    id: string
    author: JiraUser
    body: JiraDoc
    updateAuthor: JiraUser
    created: string
    updated: string
    jsdPublic: boolean
}

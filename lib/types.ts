/********************************************************************************
    Publications
*********************************************************************************/

// Author type
export interface Author {
    name: string,
    url: string
}

// Venue type
export interface Venue {
    type: "conference" | "workshop" | "journal" | "preprint",
    name: string,
    briefname: string
}

// InitialPaper type
export interface InitialPaper {
    title: string,
    url: string,
    authors: string[],
    img: string,
    venue: string,
    info: string,
    year: number,
    equal: number
}

// Paper type
export interface Paper {
    title: string,
    url: string,
    authors: Author[],
    img: string,
    venue: Venue,
    info: string,
    year: number,
    equal: number
}


/********************************************************************************
    Markdown
*********************************************************************************/

// Markdown type
export interface Markdown {
    info: { [key: string]: any},
    content: string,
    path: string
}


/********************************************************************************
    Projects
*********************************************************************************/

// Project type
export interface Project {
    name: string,
    year: number,
    media?: string,
    description: string
}

export interface ProjectData extends Markdown {
    info: Project
}

export interface ProjectDisplayProps extends Project {
    onSelect: (name: string) => void
}

/********************************************************************************
    Posts
*********************************************************************************/

// Post type
export interface Post {
    name: string,
    date: string
}

export interface PostData extends Markdown {
    info: Post
}


/********************************************************************************
    Music
*********************************************************************************/

// Piece type
export interface Piece {
    name: string,
    year: number | number[],
    url: string,
    description?: string
}

// Performance type
export interface Performance {
    url: string,
    description?: string
}
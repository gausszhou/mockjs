export interface Rule {
    parameters: RegExpExecArray | null
    range: RegExpExecArray | null
    min: number | undefined
    max: number | undefined
    count: number | undefined
    decimal: RegExpExecArray | null
    dmin: number | undefined
    dmax: number | undefined
    dcount: number | undefined
}

export interface Context {
    path: number[]
    templatePath: number[]
    currentContext: any
    templateCurrentContext: any
    root: any
    templateRoot: any
}

export interface HandlerOptions {
    type: string
    template: any
    name: string
    parsedName: string
    rule: Rule
    context: Context
}

export interface Cache {
    guid: number
    [key: number]: any
}

export interface RegexpNode {
    type: string
    offset: number
    text: string
    body?: any
    left?: any
    right?: any
    escaped?: boolean
    min?: number
    max?: number
    greedy?: boolean
    invert?: boolean
    start?: any
    end?: any
    code?: string
    quantifier?: any
    [key: string]: any
}

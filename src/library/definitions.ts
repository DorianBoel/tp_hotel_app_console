interface MenuLine {
    opt: string,
    fn?: Function
}

export type MenuLineMap = {[key: string | number]: MenuLine};

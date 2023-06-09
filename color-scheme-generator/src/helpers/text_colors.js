function determineText (hsbs) {
    // determines if color's stat text should be white or black
    let bw_text_arr = []
    for (let hsb of hsbs){
        if (210 < hsb[0] && hsb[0] < 290 && hsb[1] > 65) bw_text_arr.push("white")
        else if (hsb[2] > 65) bw_text_arr.push("black")
        else bw_text_arr.push("white")
    }
    return bw_text_arr
}

function setTextType (visible, hexvals, bw_text_arr, swtch=false) {
    // sets the text to use on Results page as visible or invisible
    if (swtch) {
        if (visible == "Show") return ["Hide", bw_text_arr]
        else if (visible == "Hide") return ["Show", hexvals]
    }
    // if not switching, keeps visible the same but resets array used
    else {
        if (visible == "Show") return [visible, hexvals]
        else if (visible == "Hide") return [visible, bw_text_arr]
    }
}

export { determineText, setTextType }
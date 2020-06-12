import React from "react"

import {Box} from "@material-ui/core"
import Navigation from "./Navigation"

export default function Layout({children, navigationOpen, setOpen}) {
    return (
        <>
            <Box display="flex" p="80px 8px">
                <Navigation navigationOpen={navigationOpen} setOpen={setOpen} />
                {children}
            </Box>
        </>
    )
}
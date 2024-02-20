import { Box, Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import React from "react";

const pages = [
    {name: "Log In", path: "/log-in", showWhenLoggedIn: false },
    {name: "Create an Account", path: "/sign-up", showWhenLoggedIn: false },
    {name: "Projects", path: "/projects", showWhenLoggedIn: true },
    {name: "Account Details", path: "/profile", showWhenLoggedIn: true },
];

type Props = {
    loggedIn: boolean
}
const Header = ({ loggedIn }: Props) => {
    return (
        <Box p={4} display="flex" alignItems="center">
            <Box display="flex" gap={4} alignItems="center">
                <Heading fontSize={24}>Tick-Tock-Task</Heading>
            </Box>
            <Box display="flex" justifyContent="space-around" w="70%">
                {pages.map((page) => {
                    if ((loggedIn && page.showWhenLoggedIn) || (!loggedIn && !page.showWhenLoggedIn))
                    {return (
                    <Link to={page.path}>
                        <Box key={page.name}>{page.name}</Box>
                    </Link>
                    );} else {
                        return null;
                    }
                })}
            </Box>
        </Box>
    );
};

export default Header;
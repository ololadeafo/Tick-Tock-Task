import { Box, Heading } from "@chakra-ui/react";
import React from "react";

const pages = [
    {name: "Log In", path: "/log-in"},
    {name: "Create an Account", path: "/sign-up"},
    {name: "Projects", path: "/projects"},
    {name: "Account Details", path: "/profile"},
];

const Header = () => {
    return (
        <Box display="flex" border="1px solid" alignItems="center">
            <Box p={4} display="flex" gap={4}>
                <Heading fontSize={28}>Tick-Tock-Task</Heading>
            </Box>
            <Box display="flex" justifyContent="space-around">
                {pages.map((page) => {
                    return <Box key={page.path}>{page.name}</Box>;
                })}
            </Box>
        </Box>
    );
};

export default Header;
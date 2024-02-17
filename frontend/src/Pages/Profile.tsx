import { Box, Button, Text, useToast } from "@chakra-ui/react"
import { useLoaderData, useNavigate } from "react-router-dom";

const Profile = () => {
    const data = useLoaderData();
    const navigate = useNavigate();
    const toast = useToast();

    const logOut = () => {
        localStorage.removeItem("token");
        navigate("/log-in");
        toast ({
            title: "Success",
            description: "Logged out successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    }


    return (
        <Box>
            <Text textAlign="center" mb={4} fontSize={20}>
                Account Details
            </Text>
            <Button onClick={logOut}>Log Out</Button>
        </Box>
    )
};

export default Profile;

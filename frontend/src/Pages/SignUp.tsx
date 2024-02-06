import { Box, Input, Text, Button, FormControl, FormLabel, FormHelperText, FormErrorMessage, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const isInvalidEmail = (email: string) => {
    const emailFormat = /\S+@\S+\.\S+/;
    if (email.match(emailFormat) && email.length > 0) {
        return false;
    } else{
        return true;
    }
}

const isInvalidPass2 = (pass1: string, pass2: string) => {
    if (pass2 !== pass1) {
        return true;
    } else {
        return false;
    }
}


const SignUp = () => {
    const navigate = useNavigate();
    const toast = useToast();


    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [secondPassword, setSecondPassword] = useState("");

    const [submitClickedName, setSubmitClickedName] = useState(false);
    const [submitClickedEmail, setSubmitClickedEmail] = useState(false);
    const [submitClickedUsername, setSubmitClickedUsername] = useState(false);
    const [submitClickedPassword, setSubmitClickedPassword] = useState(false);
    const [submitClickedSecondPassword, setSubmitClickedSecondPassword] = useState(false);

    const isErrorName = name === "" && submitClickedName;
    const isErrorEmail = isInvalidEmail(email) && submitClickedEmail;
    const isErrorUsername = username === "" && submitClickedUsername;
    const isErrorPassword = password === "" && submitClickedPassword;
    const isErrorSecondPassword = isInvalidPass2(password, secondPassword) && submitClickedSecondPassword;


    const onChangeName = (e: any) => {
        setSubmitClickedName(false);
        setName(e.target.value);
    };

    const onChangeEmail = (e: any) => {
        setSubmitClickedEmail(false);
        setEmail(e.target.value);
    };

    const onChangeUsername = (e: any) => {
        setSubmitClickedUsername(false);
        setUsername(e.target.value);
    };

    const onChangePassword = (e: any) => {
        setSubmitClickedPassword(false);
        setPassword(e.target.value);
    };

    const onChangeSecondPassword = (e: any) => {
        setSubmitClickedSecondPassword(false);
        setSecondPassword(e.target.value);
    };

    const onSubmit = () => {
        console.log("PASSWORD: ", password)
        console.log("SECOND PASSWORD: ", secondPassword)
        console.log(isInvalidPass2(password, secondPassword))

        setSubmitClickedName(true);
        setSubmitClickedEmail(true);
        setSubmitClickedUsername(true);
        setSubmitClickedPassword(true);
        setSubmitClickedSecondPassword(true);

        if (name === "" || isInvalidEmail(email) || username === "" || password === "" ||
            secondPassword !== password || 
            secondPassword === "")
         { 
            return;
        } else {
            axios.post("http://localhost:3025/auth/sign-up", { name, email, username, password }).then((response) => {
                const token = response.data;
                localStorage.setItem("token", token);

                setName("");
                setEmail("");
                setUsername("");
                setPassword("");
                setSecondPassword("");
                setSubmitClickedName(false);
                setSubmitClickedEmail(false);
                setSubmitClickedUsername(false);
                setSubmitClickedPassword(false);
                setSubmitClickedSecondPassword(false);

                navigate("/projects");
                toast({
                    title: 'Account created.',
                    description: "We've created your account for you.",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  });
            })
            .catch((error) => {
                setName("");
                setEmail("");
                setUsername("");
                setPassword("");
                setSecondPassword("");
                setSubmitClickedName(false);
                setSubmitClickedEmail(false);
                setSubmitClickedUsername(false);
                setSubmitClickedPassword(false);
                setSubmitClickedSecondPassword(false);

                console.log("ERROR", error);
                toast ({
                    title: "Error",
                    description: "We were not able to creat your account. Please try again!",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            });
        }
    };

    return (
        <Box>
            <Text textAlign="center" mb={4} fontSize={20}>Create An Account</Text>
            <Box maxW="75%" display="flex" flexDirection="column" alignItems="center" margin="0 auto" gap={4}>
                <FormControl isInvalid={isErrorName} isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input type='text' value={name} onChange={onChangeName} />
                    {!isErrorName ? (
                        null
                    ) : (
                        <FormErrorMessage>Name is required.</FormErrorMessage>
                    )}
                </FormControl>

                <FormControl isInvalid={isErrorEmail} isRequired>
                    <FormLabel>Email address</FormLabel>
                    <Input type='email' value={email} onChange={onChangeEmail} />
                    {!isErrorEmail ? (
                        null
                    ) : (
                        <FormErrorMessage>A valid email address is required</FormErrorMessage>
                    )}
                </FormControl>

                <FormControl isInvalid={isErrorUsername} isRequired>
                    <FormLabel>Username</FormLabel>
                    <Input type='text' value={username} onChange={onChangeUsername} />
                    {!isErrorUsername ? (
                        null
                    ) : (
                        <FormErrorMessage>Username is required</FormErrorMessage>
                    )}
                </FormControl>

                <FormControl isInvalid={isErrorPassword} isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input type='password' value={password} onChange={onChangePassword} />
                    {!isErrorPassword ? (
                        null
                    ) : (
                        <FormErrorMessage>Password is required</FormErrorMessage>
                    )}
                </FormControl>

                <FormControl isInvalid={isErrorSecondPassword} isRequired>
                    <FormLabel>Enter Password again</FormLabel>
                    <Input type='password' value={secondPassword} onChange={onChangeSecondPassword} />
                    {!isErrorSecondPassword ? (
                        null
                    ) : (
                        <FormErrorMessage>Passwords must match</FormErrorMessage>
                    )}
                </FormControl>

                <Button w="100%" onClick={onSubmit}>Submit</Button>
            </Box>
        </Box>
    );
};

export default SignUp;
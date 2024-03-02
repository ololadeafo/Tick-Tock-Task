import { 
    Box,
    Text, 
    Button, 
    Input, 
    Modal, 
    ModalBody, 
    ModalCloseButton, 
    ModalContent, 
    ModalHeader, 
    ModalOverlay, 
    useToast
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { isInvalidEmail } from "../../Pages/SignUp";

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

const ForgotPasswordModal = ({ isOpen, onClose}: Props) => {
    const toast = useToast();
    const [email, setEmail] = useState ("");

    const saveEmail = (e: any) => {
        setEmail(e.target.value);
    };

    const submitEmail = () => {
        console.log("EMAIL", email);
        const invalidEmail = isInvalidEmail(email);
        if (invalidEmail) {
            toast({
                title: "Error",
                description: "Please enter a valid email address!",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } else {
            axios.post("http://localhost:3025/auth/reset-password", { 
                email, 
            })
            .then((response) => {
                setEmail("");
                console.log('RESPONSE', response.data)
                toast({
                    title: "Success",
                    description: "Check your email inbox for further directions.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            })
            .catch((error) => {
                if (error.response.data.message === 'email not found') {
                    toast({
                        title: "Success",
                        description: "Check your email inbox for further directions.",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                } else {
                    toast ({
                        title: "Error",
                        description: error.response.data.message,
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                }
            });
        }
        onClose();    
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box>
                            <Text mb={6}>Enter the email address associated with your account:</Text>
                            <Input
                                type={"text"} onChange={saveEmail}
                            />
                        </Box>
                    </ModalBody>
                        <Button mx={6} mb={4} mt={2} onClick={submitEmail}>
                            Send Verification Email
                        </Button>
                </ModalContent>
            </Modal>
    )
}

export default ForgotPasswordModal;
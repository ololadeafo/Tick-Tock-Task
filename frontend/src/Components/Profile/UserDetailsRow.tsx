import { Box, Text, IconButton, Input, useToast } from "@chakra-ui/react"
import { CheckIcon, EditIcon } from "@chakra-ui/icons";
import { useState } from "react";
import axios from "axios";
import { isInvalidEmail } from "../../Pages/SignUp";
import { Data } from "../../Pages/Profile";

type Props = {
    field: string;
    value: string;
    username: string;
    setData: React.Dispatch<React.SetStateAction<Data>>;
}
const UserDetailsRow = ({field, value, username, setData }: Props) => {
    const toast = useToast();

    const [updateField, setUpdateField] = useState(false);
    const [valueState, setValueState] = useState(value);

    const onChange = (e: any) => {
        setValueState(e.target.value)
    }

    const onClickEdit = () => {
        setUpdateField(!updateField);
    }

    const onClickCheck = () => {
        if(field === "Email") {
            const invalidEmail = isInvalidEmail(valueState);
            if (invalidEmail) {
                toast ({
                    title: "Error",
                    description: "Please enter a valid email",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }
        } else {
            if  (valueState === '') {
                toast ({
                    title: "Error",
                    description: "Please enter a valid value",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                return 
            }
        }
        const token = localStorage.getItem("token");

        setUpdateField(!updateField);

        axios.post("http://localhost:3025/auth/change-account-detail", { 
            username,
            field: field.toLowerCase(),
            value: valueState
        }, {headers: { Authorization: `Bearer ${token}` } }
        ).then((response) => {
            console.log("RESPONSE", response.data);
            setData(response.data);
            toast ({
                title: "Success",
                description: "Account details have been updated",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        });
    };

    return (
        <Box display="flex" gap={2}>
            <Text flex={1} lineHeight="32px">
                {field}:
            </Text>
            {updateField ? (
                <Input
                    flex={1}
                    h="32px"
                    value={valueState}
                    onChange={onChange}
                    type={field === "Password" ? "password" : "text"}
                />
            ) : (
                <Text flex={1} lineHeight="32px">
                    {field === "Password" ? "***********" : valueState}
                </Text>
            )}
            <IconButton
                aria-label="Edit Name"
                icon={updateField ? <CheckIcon /> : <EditIcon />}
                size="sm"
                onClick={updateField ? onClickCheck : onClickEdit}
            />
        </Box>
    );
};

export default UserDetailsRow;
'use client'

import { Alert, AlertDescription, AlertIcon, AlertTitle, Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Input, Text, Textarea, VStack } from '@chakra-ui/react';
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home({ params }: { params: { projectId: string } }) {
    const router = useRouter();

    const [taskTitle, setTaskTitle] = useState<string>('');
    const [taskDescription, setTaskDescription] = useState<string>('');

    const [isTaskNameInvalid, setIsTaskNameInvalid] = useState<boolean>(false);
    const [taskNameErrorDescription, setTaskNameErrorDescription] = useState<string>('');

    const [isCreateButtonDisabled, setIsCreateButtonDisabled] = useState<boolean>(true);

    const [error, setError] = useState(false);
    const [errorTitle, setErrorTitle] = useState<string | null>(null);
    const [errorDescription, setErrorDescription] = useState<string | null>(null);

    const handleTaskNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError(false);
        setErrorTitle('')
        setErrorDescription('');

        setIsTaskNameInvalid(false);
        setTaskNameErrorDescription('');

        setIsCreateButtonDisabled(false);

        const taskName = event.target.value;

        setTaskTitle(taskName);

        if (taskName.length === 0) {
            setIsTaskNameInvalid(true);
            setTaskNameErrorDescription('Project name cannot be empty.');

            setIsCreateButtonDisabled(true);
        } else {
            setIsCreateButtonDisabled(false);
        }
    };

    const handleTaskDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setError(false);
        setErrorTitle('')
        setErrorDescription('');

        setTaskDescription(event.target.value);
    };

    const handleTaskCreation = async (event: React.MouseEvent<HTMLButtonElement>) => {
        if (isTaskNameInvalid) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Please review and address the issues in the form before proceeding.');

            return
        }

        const body = JSON.stringify({
            title: taskTitle,
            description: taskDescription,
            project: params.projectId
        });

        let url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${process.env.NEXT_PUBLIC_BACKEND_API_PREFIX}/tasks/`);

        let response;

        try {
            response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body
            });
        } catch (error) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while creating task.\n' + 'Please try again later.');

            return
        }

        if (!response) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while creating task.\n' + 'Please try again later.');

            return
        }

        if (response.status !== 201) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while creating task.\n' + 'Please try again later.');
        }

        const jsonResponse = await response.json();

        router.push('/');
    };

    return (
        <VStack align={'right'} padding={'10%'}>
            <Heading as='h2' size='xl' noOfLines={1}>Task</Heading>

            {error ? (
                <Alert status='error' rounded={'initial'}>
                    <AlertIcon />
                    <AlertTitle>{errorTitle}</AlertTitle>
                    <AlertDescription>{errorDescription}</AlertDescription>
                </Alert>
            ) : (
                <></>
            )}

            <FormControl isRequired isInvalid={isTaskNameInvalid} >
                <FormLabel>Name of the task</FormLabel>
                <Input placeholder='For example, &quot;AgileFlow&quot;' value={taskTitle} onChange={handleTaskNameChange} />
                <FormErrorMessage>{taskNameErrorDescription}</FormErrorMessage>
            </FormControl>

            <FormControl>
                <FormLabel>Description of the task</FormLabel>
                <Textarea placeholder='For example, &quot;Develop Agile Task Management for efficient collaboration and real-time tracking.&quot;' value={taskDescription} onChange={handleTaskDescriptionChange} />
            </FormControl>

            <Button colorScheme='blue' isDisabled={isCreateButtonDisabled} onClick={handleTaskCreation}>Create</Button>
        </VStack>
    );
};

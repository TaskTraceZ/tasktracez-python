'use client'

import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Stack, Spacer, Textarea, VStack } from '@chakra-ui/react';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home({ params }: { params: { projectId: string, taskId: string } }) {
    const router = useRouter();

    const [displayForm, setDisplayForm] = useState<boolean>(false);

    const [taskTitle, setTaskTitle] = useState<string>('');
    const [taskDescription, setTaskDescription] = useState<string>('');
    const [projectId, setProjectId] = useState<number>();

    const [isTaskNameInvalid, setIsTaskNameInvalid] = useState<boolean>(false);
    const [taskNameErrorDescription, setTaskNameErrorDescription] = useState<string>('');

    const [isUpdateButtonDisabled, setIsUpdateButtonDisabled] = useState<boolean>(true);

    const [error, setError] = useState(false);
    const [errorTitle, setErrorTitle] = useState<string | null>(null);
    const [errorDescription, setErrorDescription] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleTaskNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError(false);
        setErrorTitle('')
        setErrorDescription('');

        setIsTaskNameInvalid(false);
        setTaskNameErrorDescription('');

        if (isUpdateButtonDisabled) {
            setIsUpdateButtonDisabled(false);
        }

        const projectName = event.target.value;

        setTaskTitle(projectName);

        if (projectName.length === 0) {
            setIsTaskNameInvalid(true);
            setTaskNameErrorDescription('Project name cannot be empty.');

            setIsUpdateButtonDisabled(true);
        } else {
            setIsUpdateButtonDisabled(false);
        }
    };

    const handleTaskDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setError(false);
        setErrorTitle('')
        setErrorDescription('');

        setTaskDescription(event.target.value);

        if (isUpdateButtonDisabled) {
            setIsUpdateButtonDisabled(false);
        }
    };

    const handleTaskUpdation = async (event: React.MouseEvent<HTMLButtonElement>) => {
        setIsLoading(true);

        if (isTaskNameInvalid) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Please review and address the issues in the form before proceeding.');

            setIsLoading(false);

            return
        }

        const body = JSON.stringify({
            title: taskTitle,
            description: taskDescription,
            project: projectId
        });

        let url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${process.env.NEXT_PUBLIC_BACKEND_API_PREFIX}/tasks/${params.taskId}/`);

        let response;

        try {
            response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body
            });
        } catch (error) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while updating task.\n' + 'Please try again later.');

            setIsLoading(false);

            return
        }

        if (!response) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while updating task.\n' + 'Please try again later.');

            setIsLoading(false);

            return
        }

        if (response.status !== 200) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while updating task.\n' + 'Please try again later.');

            setIsLoading(false);

            return
        }

        const jsonResponse = await response.json();

        setIsLoading(false);

        setIsUpdateButtonDisabled(true);
    };

    const handleTaskDeletion = async (event: React.MouseEvent<HTMLButtonElement>) => {
        let url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${process.env.NEXT_PUBLIC_BACKEND_API_PREFIX}/tasks/${params.taskId}/`);

        let response;

        try {
            response = await fetch(url, {
                method: 'DELETE'
            });
        } catch (error) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while deleting task.\n' + 'Please try again later.');

            return
        }

        if (!response) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while deleting task.\n' + 'Please try again later.');

            return
        }

        if (response.status !== 204) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while deleting task.\n' + 'Please try again later.');

            return
        }

        router.back();
    };

    useEffect(() => {
        const fetchAndSetTaskData = async () => {
            let url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${process.env.NEXT_PUBLIC_BACKEND_API_PREFIX}/tasks/${params.taskId}/`);

            let response;

            try {
                response = await fetch(url);
            } catch (error) {
                setError(true);
                setErrorTitle('Error processing request:')
                setErrorDescription('Oops! Something went wrong while fetching task.\n' + 'Please try again later.');

                return
            }

            if (!response) {
                setError(true);
                setErrorTitle('Error processing request:')
                setErrorDescription('Oops! Something went wrong while fetching task.\n' + 'Please try again later.');

                return
            }

            if (response.status === 404) {
                setError(true);
                setErrorTitle('Error processing request:')
                setErrorDescription('Resource not found.');

                return
            }

            if (response.status !== 200) {
                setError(true);
                setErrorTitle('Error processing request:')
                setErrorDescription('Oops! Something went wrong while fetching task.\n' + 'Please try again later.');

                return
            }

            const jsonResponse = await response.json();

            return jsonResponse;
        };

        fetchAndSetTaskData().then(response => {
            if (response) {
                setDisplayForm(true);

                setTaskTitle(response.title);
                setTaskDescription(response.description);
                setProjectId(response.project);
            }
        });
    }, [params.projectId, params.taskId]);

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

            {displayForm ? (
                <>
                    <FormControl isRequired isInvalid={isTaskNameInvalid} >
                        <FormLabel>Name of the task</FormLabel>
                        <Input placeholder='For example, &quot;AgileFlow&quot;' value={taskTitle} onChange={handleTaskNameChange} />
                        <FormErrorMessage>{taskNameErrorDescription}</FormErrorMessage>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Description of the task</FormLabel>
                        <Textarea placeholder='For example, &quot;Develop Agile Task Management for efficient collaboration and real-time tracking.&quot;' value={taskDescription} onChange={handleTaskDescriptionChange} />
                    </FormControl>

                    <Flex>
                        <Spacer />
                        <Stack direction='row' spacing={4}>
                            <Button colorScheme='blue' isLoading={isLoading} isDisabled={isUpdateButtonDisabled} onClick={handleTaskUpdation}>Update</Button>
                            <Button colorScheme='red' onClick={handleTaskDeletion}>Delete</Button>
                        </Stack>
                    </Flex>
                </>
            ) : (
                <></>
            )}
        </VStack>
    );
};

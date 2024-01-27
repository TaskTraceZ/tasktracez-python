'use client'

import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Stack, Spacer, Textarea, VStack } from '@chakra-ui/react';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home({ params }: { params: { projectId: string } }) {
    const router = useRouter();

    const [displayForm, setDisplayForm] = useState<boolean>(false);

    const [projectTitle, setProjectTitle] = useState<string>('');
    const [projectDescription, setProjectDescription] = useState<string>('');

    const [isProjectNameInvalid, setIsProjectNameInvalid] = useState<boolean>(false);
    const [projectNameErrorDescription, setProjectNameErrorDescription] = useState<string>('');

    const [isUpdateButtonDisabled, setIsUpdateButtonDisabled] = useState<boolean>(true);

    const [error, setError] = useState(false);
    const [errorTitle, setErrorTitle] = useState<string | null>(null);
    const [errorDescription, setErrorDescription] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleTasksQuerying = () => {
        setIsLoading(true);

        router.push(`${params.projectId}/tasks`);
    };

    const handleProjectNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError(false);
        setErrorTitle('')
        setErrorDescription('');

        setIsProjectNameInvalid(false);
        setProjectNameErrorDescription('');

        if (isUpdateButtonDisabled) {
            setIsUpdateButtonDisabled(false);
        }

        const projectName = event.target.value;

        setProjectTitle(projectName);

        if (projectName.length === 0) {
            setIsProjectNameInvalid(true);
            setProjectNameErrorDescription('Project name cannot be empty.');

            setIsUpdateButtonDisabled(true);
        } else {
            setIsUpdateButtonDisabled(false);
        }
    };

    const handleProjectDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setError(false);
        setErrorTitle('')
        setErrorDescription('');

        setProjectDescription(event.target.value);

        if (isUpdateButtonDisabled) {
            setIsUpdateButtonDisabled(false);
        }
    };

    const handleProjectUpdation = async (event: React.MouseEvent<HTMLButtonElement>) => {
        setIsLoading(true);

        if (isProjectNameInvalid) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Please review and address the issues in the form before proceeding.');

            setIsLoading(false);

            return
        }

        const body = JSON.stringify({
            title: projectTitle,
            description: projectDescription
        });

        let url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${process.env.NEXT_PUBLIC_BACKEND_API_PREFIX}/projects/${params.projectId}/`);

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
            setErrorDescription('Oops! Something went wrong while updating project.\n' + 'Please try again later.');

            setIsLoading(false);

            return
        }

        if (!response) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while updating project.\n' + 'Please try again later.');

            setIsLoading(false);

            return
        }

        if (response.status !== 200) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while updating project.\n' + 'Please try again later.');
        }

        const jsonResponse = await response.json();

        setIsLoading(false);

        setIsUpdateButtonDisabled(true);
    };

    const handleProjectDeletion = async (event: React.MouseEvent<HTMLButtonElement>) => {
        let url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${process.env.NEXT_PUBLIC_BACKEND_API_PREFIX}/projects/${params.projectId}/`);

        let response;

        try {
            response = await fetch(url, {
                method: 'DELETE'
            });
        } catch (error) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while deleting project.\n' + 'Please try again later.');

            return
        }

        if (!response) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while deleting project.\n' + 'Please try again later.');

            return
        }

        if (response.status !== 204) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while deleting project.\n' + 'Please try again later.');

            return
        }

        router.back();
    };

    useEffect(() => {
        const fetchAndSetProjectData = async () => {
            let url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${process.env.NEXT_PUBLIC_BACKEND_API_PREFIX}/projects/${params.projectId}/`);
    
            let response;
    
            try {
                response = await fetch(url);
            } catch (error) {
                setError(true);
                setErrorTitle('Error processing request:')
                setErrorDescription('Oops! Something went wrong while fetching project.\n' + 'Please try again later.');
    
                return
            }
    
            if (!response) {
                setError(true);
                setErrorTitle('Error processing request:')
                setErrorDescription('Oops! Something went wrong while fetching project.\n' + 'Please try again later.');
    
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
                setErrorDescription('Oops! Something went wrong while fetching project.\n' + 'Please try again later.');
    
                return
            }
    
            const jsonResponse = await response.json();
    
            return jsonResponse;
        };
        
        fetchAndSetProjectData().then(response => {
            if (response) {
                setDisplayForm(true);

                setProjectTitle(response.title);
                setProjectDescription(response.description);
            }
        });
    }, [params.projectId]);

    return (
        <VStack align={'right'} padding={'10%'}>
            <Heading as='h2' size='xl' noOfLines={1}>Project</Heading>

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
                    <FormControl isRequired isInvalid={isProjectNameInvalid} >
                        <FormLabel>Name of the project</FormLabel>
                        <Input placeholder='For example, &quot;Agile Task Management&quot;' value={projectTitle} onChange={handleProjectNameChange} />
                        <FormErrorMessage>{projectNameErrorDescription}</FormErrorMessage>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Description of the project</FormLabel>
                        <Textarea placeholder='For example, &quot;Streamline task management processes for enhanced team efficiency and collaboration.&quot;' value={projectDescription} onChange={handleProjectDescriptionChange} />
                    </FormControl>

                    <Flex>
                        <Spacer />
                        <Stack direction='row' spacing={4}>
                        <Button colorScheme='blue' isLoading={isLoading} isDisabled={isUpdateButtonDisabled} onClick={handleProjectUpdation}>Update</Button>
                            <Button colorScheme='red' onClick={handleProjectDeletion}>Delete</Button>
                        </Stack>
                    </Flex>

                    <Flex>
                        <Box>
                            <Button colorScheme='gray' size={'lg'} fontSize={'x-large'} isLoading={isLoading} onClick={handleTasksQuerying}>Tasks</Button>
                        </Box>
                        <Spacer />
                    </Flex>
                </>
            ) : (
                <></>
            )}
        </VStack>
    );
};

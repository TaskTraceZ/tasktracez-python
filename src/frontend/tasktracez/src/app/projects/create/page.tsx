'use client'

import { Alert, AlertDescription, AlertIcon, AlertTitle, Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Input, Text, Textarea, VStack } from '@chakra-ui/react';
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
    const router = useRouter();

    const [projectTitle, setProjectTitle] = useState<string>('');
    const [projectDescription, setProjectDescription] = useState<string>('');

    const [isProjectNameInvalid, setIsProjectNameInvalid] = useState<boolean>(false);
    const [projectNameErrorDescription, setProjectNameErrorDescription] = useState<string>('');

    const [isCreateButtonDisabled, setIsCreateButtonDisabled] = useState<boolean>(true);

    const [error, setError] = useState(false);
    const [errorTitle, setErrorTitle] = useState<string | null>(null);
    const [errorDescription, setErrorDescription] = useState<string | null>(null);

    const handleProjectNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError(false);
        setErrorTitle('')
        setErrorDescription('');

        setIsProjectNameInvalid(false);
        setProjectNameErrorDescription('');

        setIsCreateButtonDisabled(false);

        const projectName = event.target.value;

        setProjectTitle(projectName);

        if (projectName.length === 0) {
            setIsProjectNameInvalid(true);
            setProjectNameErrorDescription('Project name cannot be empty.');

            setIsCreateButtonDisabled(true);
        } else {
            setIsCreateButtonDisabled(false);
        }
    };

    const handleProjectDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setError(false);
        setErrorTitle('')
        setErrorDescription('');

        setProjectDescription(event.target.value);
    };

    const handleProjectCreation = async (event: React.MouseEvent<HTMLButtonElement>) => {
        if (isProjectNameInvalid) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Please review and address the issues in the form before proceeding.');

            return
        }

        const body = JSON.stringify({
            title: projectTitle,
            description: projectDescription
        });

        let url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${process.env.NEXT_PUBLIC_BACKEND_API_PREFIX}/projects/`);

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
            setErrorDescription('Oops! Something went wrong while creating project.\n' + 'Please try again later.');

            return
        }

        if (!response) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while creating project.\n' + 'Please try again later.');

            return
        }

        if (response.status !== 201) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while creating project.\n' + 'Please try again later.');
        }

        const jsonResponse = await response.json();

        router.push('/');
    };

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

            <FormControl isRequired isInvalid={isProjectNameInvalid} >
                <FormLabel>Name of the project</FormLabel>
                <Input placeholder='For example, &quot;Agile Task Management&quot;' value={projectTitle} onChange={handleProjectNameChange} />
                <FormErrorMessage>{projectNameErrorDescription}</FormErrorMessage>
            </FormControl>

            <FormControl>
                <FormLabel>Description of the project</FormLabel>
                <Textarea placeholder='For example, &quot;Streamline task management processes for enhanced team efficiency and collaboration.&quot;' value={projectDescription} onChange={handleProjectDescriptionChange} />
            </FormControl>

            <Button colorScheme='blue' isDisabled={isCreateButtonDisabled} onClick={handleProjectCreation}>Create</Button>
        </VStack>
    );
};

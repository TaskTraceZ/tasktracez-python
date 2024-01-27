'use client'

import Project from "@/types/Project";
import Task from "@/types/Task";
import { Alert, AlertDescription, AlertIcon, AlertTitle, Button, FormControl, FormLabel, Heading, Select, Switch, VStack } from '@chakra-ui/react';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
    const router = useRouter();

    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);

    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [billable, setBillable] = useState<boolean>(false);

    const [error, setError] = useState(false);
    const [errorTitle, setErrorTitle] = useState<string | null>(null);
    const [errorDescription, setErrorDescription] = useState<string | null>(null);

    const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = parseInt(event.target.value, 10);

        setSelectedProjectId(selectedValue);

        fetchAndSetProjectTasksData(selectedValue);
    };

    const handleProjectTaskChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = parseInt(event.target.value, 10);

        setSelectedTaskId(selectedValue);
    };

    const fetchAndSetProjectsData = async () => {
        let url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${process.env.NEXT_PUBLIC_BACKEND_API_PREFIX}/projects/`);

        let response;

        try {
            response = await fetch(url);
        } catch (error) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while fetching projects.\n' + 'Please try again later.');

            return
        }

        if (!response) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while fetching projects.\n' + 'Please try again later.');

            return
        }

        if (response.status !== 200) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while fetching projects.\n' + 'Please try again later.');
        }

        const jsonResponse = await response.json();

        if (!Array.isArray(jsonResponse)) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while fetching projects.\n' + 'Please try again later.');

            return
        }

        setProjects(jsonResponse);
    };

    const fetchAndSetProjectTasksData = async (id: number) => {
        let url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${process.env.NEXT_PUBLIC_BACKEND_API_PREFIX}/projects/${id}/tasks/`);

        let response;

        try {
            response = await fetch(url);
        } catch (error) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while fetching tasks.\n' + 'Please try again later.');

            return
        }

        if (!response) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while fetching tasks.\n' + 'Please try again later.');

            return
        }

        if (response.status !== 200) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while fetching tasks.\n' + 'Please try again later.');
        }

        const jsonResponse = await response.json();

        if (!Array.isArray(jsonResponse)) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while fetching tasks.\n' + 'Please try again later.');

            return
        }

        setTasks(jsonResponse);
    };

    const handleTaskInstanceCreation = async (event: React.MouseEvent<HTMLButtonElement>) => {
        const body = JSON.stringify({
            task: selectedTaskId,
            billable: billable
        });

        let url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${process.env.NEXT_PUBLIC_BACKEND_API_PREFIX}/task_instances/`);

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
            setErrorDescription('Oops! Something went wrong while fetching task instance.\n' + 'Please try again later.');

            return
        }

        if (!response) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while fetching task instance.\n' + 'Please try again later.');

            return
        }

        if (response.status !== 201) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while fetching task instance.\n' + 'Please try again later.');
        }

        const jsonResponse = await response.json();

        router.push('/');
    };

    useEffect(() => {
        fetchAndSetProjectsData();
    }, []);

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

            <FormControl>
                <Select placeholder='Select project' value={selectedProjectId || ''} onChange={handleProjectChange}>
                    {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                            {project.title}
                        </option>
                    ))}
                </Select>
            </FormControl>

            <FormControl>
                <Select placeholder='Select task' value={selectedTaskId || ''} onChange={handleProjectTaskChange}>
                    {tasks.map((task) => (
                        <option key={task.id} value={task.id}>
                            {task.title}
                        </option>
                    ))}
                </Select>
            </FormControl>
            
            <FormControl display='flex' alignItems='center'>
                <FormLabel htmlFor='billable-toggle' mb='0'>
                    Billable
                </FormLabel>
                <Switch id='billable-toggle' isChecked={billable} onChange={() => setBillable(!billable)} />
            </FormControl>

            <Button colorScheme='blue' onClick={handleTaskInstanceCreation}>Create</Button>
        </VStack>
    );
};

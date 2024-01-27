'use client'

import Task from '@/types/Task';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Card, CardBody, Flex, Heading, IconButton, Spacer, Stack, StackDivider, Text, VStack } from '@chakra-ui/react';
import { faArrowRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home({ params }: { params: { projectId: string } }) {
    const router = useRouter();

    const [tasks, setTasks] = useState<Task[]>([]);

    const [error, setError] = useState(false);
    const [errorTitle, setErrorTitle] = useState<string | null>(null);
    const [errorDescription, setErrorDescription] = useState<string | null>(null);

    const [loadingTaskId, setLoadingTaskId] = useState<number | null>(null);

    const handleTaskAddition = () => {
        router.push('tasks/create');
    };

    const handleTaskDetailsQuerying = (id: number) => {
        setLoadingTaskId(id);

        router.push(`tasks/${id}`);
    };

    useEffect(() => {
        const fetchAndSetTasksData = async () => {
            let url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${process.env.NEXT_PUBLIC_BACKEND_API_PREFIX}/projects/${params.projectId}/tasks/`);
            const queryParameters = {
                sort_by: 'title'
            };

            url.search = new URLSearchParams(queryParameters).toString();

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

        fetchAndSetTasksData();
    }, [params.projectId]);

    return (
        <VStack align={'right'} padding={'10%'}>
            <Heading as='h2' size='xl' noOfLines={1}>Tasks</Heading>

            <Flex>
                <Spacer />
                <Box textAlign={'right'}>
                    <IconButton aria-label='Search database' icon={<FontAwesomeIcon icon={faPlus} size='xl' />} onClick={handleTaskAddition} />
                </Box>
            </Flex>

            {error ? (
                <Alert status='error' rounded={'initial'}>
                    <AlertIcon />
                    <AlertTitle>{errorTitle}</AlertTitle>
                    <AlertDescription>{errorDescription}</AlertDescription>
                </Alert>
            ) : (
                <></>
            )}

            {tasks.length > 0 ? (
                <Card>
                    <CardBody>
                        <Stack divider={<StackDivider />} spacing='4'>
                            {tasks.map((task) => (
                                <Box key={task.id}>
                                    <Flex>
                                        <Box textAlign={'left'}>
                                            <Text pt='2' fontSize='large'>
                                                {task.title}
                                            </Text>
                                        </Box>
                                        <Spacer />
                                        <Box textAlign={'right'}>
                                            <IconButton
                                                aria-label='Search database'
                                                isLoading={loadingTaskId === task.id}
                                                onClick={() => handleTaskDetailsQuerying(task.id)}
                                                icon={<FontAwesomeIcon icon={faArrowRight} size='lg' />}
                                            />
                                        </Box>
                                    </Flex>
                                </Box>
                            ))}
                        </Stack>
                    </CardBody>
                </Card>
            ) : (
                <Flex>
                    <Spacer />
                    <Box>
                        <Text fontSize='md'>It&apos;s pretty empty here! Add some tasks to fill the space.</Text>
                    </Box>
                    <Spacer />
                </Flex>
            )}
        </VStack>
    )
}

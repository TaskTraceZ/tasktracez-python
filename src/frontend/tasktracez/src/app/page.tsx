'use client'

import TaskInstance from '@/types/TaskInstance';
import { faArrowLeft, faArrowRight, faPause, faPlay, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { getPreviousDate, getNextDate, getFormattedDate, convertDateToTime } from '@/utils/date';
import { convertTimeToSeconds, convertSecondsToTime } from '@/utils/date';
import { redirect, useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Card, CardHeader, CardBody, Center, Flex, Heading, IconButton, Spacer, Text, VStack, StackDivider, Stack } from '@chakra-ui/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
    const { data: session, status } = useSession();

    const router = useRouter();

    const [taskInstances, setTaskInstances] = useState<TaskInstance[]>([]);
    const [inProgressTaskInstance, setInProgressTaskInstance] = useState<TaskInstance | null>(null);
    const [inProgressTaskInstanceDurationWorked, setInProgressTaskInstanceDurationWorked] = useState<number>(0);

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const [error, setError] = useState(false);
    const [errorTitle, setErrorTitle] = useState<string | null>(null);
    const [errorDescription, setErrorDescription] = useState<string | null>(null);

    const clearError = () => {
        if (error) {
            setError(false);
            setErrorDescription('');
        }
    }

    const handleTaskInstanceAddition = () => {
        router.push('/task_instances/create')
    };

    const handleTaskInstanceContinuation = async (id: number) => {
        const startedAt = convertDateToTime(new Date());

        clearError();

        let url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${process.env.NEXT_PUBLIC_BACKEND_API_PREFIX}/task_instances/${id}/start/`);
        const queryParameters = {
            started_at: startedAt
        };

        url.search = new URLSearchParams(queryParameters).toString();

        let response;

        try {
            response = await fetch(url, {
                method: 'POST'
            });
        } catch (error) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while fetching task instances.\n' + 'Please try again later.');

            return
        }

        if (!response) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while fetching task instances.\n' + 'Please try again later.');

            return
        }

        if (response.status !== 200) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while fetching task instances.\n' + 'Please try again later.');
        }

        const jsonResponse = await response.json();

        const updatedTaskInstances = [...taskInstances];

        const startedTaskIndex = updatedTaskInstances.findIndex(task => task.id === id);

        updatedTaskInstances[startedTaskIndex] = jsonResponse;

        setTaskInstances(updatedTaskInstances);

        setInProgressTaskInstance(jsonResponse);
    }

    const handleTaskInstanceStoppage = async (id: number) => {
        const stoppedAt = convertDateToTime(new Date());

        clearError();

        let url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${process.env.NEXT_PUBLIC_BACKEND_API_PREFIX}/task_instances/${id}/stop/`);
        const queryParameters = {
            stopped_at: stoppedAt
        };

        url.search = new URLSearchParams(queryParameters).toString();

        let response;

        try {
            response = await fetch(url, {
                method: 'POST'
            });
        } catch (error) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while fetching task instances.\n' + 'Please try again later.');

            return
        }

        if (!response) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while fetching task instances.\n' + 'Please try again later.');

            return
        }

        if (response.status !== 200) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while fetching task instances.\n' + 'Please try again later.');
        }

        const jsonResponse = await response.json();

        const updatedTaskInstances = [...taskInstances];

        const stoppedTaskIndex = updatedTaskInstances.findIndex(task => task.id === id);

        updatedTaskInstances[stoppedTaskIndex] = jsonResponse;

        setTaskInstances(updatedTaskInstances);

        setInProgressTaskInstance(null);
    }

    const fetchAndSetTaskInstancesData = async (startDate: string, endDate: string) => {
        let url = new URL(`${process.env.NEXT_PUBLIC_ENDPOINT}/${process.env.NEXT_PUBLIC_STAGE}/${process.env.NEXT_PUBLIC_PREFIX}/${process.env.NEXT_PUBLIC_VERSION}/task-instances/`);
        
        let headers = new Headers();
        
        headers.append('Content-Type', 'application/json');

        if (session) {
            headers.append('Authorization', session.idToken);
        }

        const queryParameters = {
            start_date: startDate,
            end_date: endDate,
            // sort_by: 'created_at',
            // sort_order: 'desc'
        };

        url.search = new URLSearchParams(queryParameters).toString();

        let response;

        try {
            response = await fetch(url, {headers: headers});
        } catch (error) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while fetching task instances.\n' + 'Please try again later.');

            return
        }

        if (!response) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while fetching task instances.\n' + 'Please try again later.');

            return
        }

        if (response.status !== 200) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while fetching task instances.\n' + 'Please try again later.');
        }

        const jsonResponse = await response.json();

        if (!Array.isArray(jsonResponse)) {
            setError(true);
            setErrorTitle('Error processing request:')
            setErrorDescription('Oops! Something went wrong while fetching task instances.\n' + 'Please try again later.');

            return
        }

        setTaskInstances(jsonResponse);

        return jsonResponse;
    };

    useEffect(() => {
        if (status === "unauthenticated") {
            signIn();
        } else if (status === "authenticated") {
            const currentDate = new Date();

            setStartDate(currentDate);
            setEndDate(getNextDate(currentDate));
        }
    }, [status]);

    useEffect(() => {
        if (startDate && endDate) {
            fetchAndSetTaskInstancesData(getFormattedDate(startDate), getFormattedDate(endDate)).then(updatedTaskInstances => {
                if (updatedTaskInstances) {
                    const inProgressTaskInstance = updatedTaskInstances.find((task) => task.in_progress === true);

                    if (inProgressTaskInstance) {
                        setInProgressTaskInstance(inProgressTaskInstance);
                    }
                }
            });
        }
    }, [startDate, endDate]);

    useEffect(() => {
        let intervalId: string | number | NodeJS.Timeout | undefined;

        if (inProgressTaskInstance) {
            const inProgressTaskInstanceDurationWorked = convertTimeToSeconds(inProgressTaskInstance.duration_worked);

            setInProgressTaskInstanceDurationWorked(inProgressTaskInstanceDurationWorked);

            intervalId = setInterval(() => {
                setInProgressTaskInstanceDurationWorked(prevTime => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(intervalId);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [inProgressTaskInstance]);

    return (
        <>
            {session && (
                <>
                    <VStack align={'right'} padding={'10%'}>
                        <Heading as='h2' size='xl' noOfLines={1}>Tasks</Heading>

                        <Flex>
                            <Box w='170px' h='10'>
                                <IconButton aria-label='Search database' icon={<FontAwesomeIcon icon={faArrowLeft} size='lg' />} />
                            </Box>
                            <Spacer />
                            <Box w='300px' h='10' textAlign={'center'}>
                                <Center w='full' h='full'>
                                    <Heading as='h5' size='sm'>
                                        {startDate ? getFormattedDate(startDate) : ''}
                                    </Heading>
                                </Center>
                            </Box>
                            <Spacer />
                            <Box w='170px' h='10' textAlign={'right'}>
                                <IconButton aria-label='Search database' icon={<FontAwesomeIcon icon={faArrowRight} size='lg' />} />
                            </Box>
                        </Flex>

                        <Flex>
                            <Spacer />
                            <Box textAlign={'right'}>
                                <IconButton aria-label='Search database' icon={<FontAwesomeIcon icon={faPlus} size='xl' />} onClick={handleTaskInstanceAddition} />
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

                        {taskInstances.length > 0 ? (
                            <Card>
                                <CardBody>
                                    <Stack divider={<StackDivider />} spacing='4'>
                                        {taskInstances.map((taskInstance) => (
                                            <Box key={taskInstance.id}>
                                                <Flex>
                                                    <Box w={'80%'} textAlign={'left'}>
                                                        <Text pt='2' fontSize='large'>
                                                            {taskInstance.task_title}
                                                        </Text>
                                                    </Box>
                                                    <Spacer />
                                                    <Box w={'50%'} textAlign={'left'}>
                                                        <Text pt='2' fontSize='sm'>
                                                            {taskInstance.project_title}
                                                        </Text>
                                                    </Box>
                                                    <Spacer />
                                                    {taskInstance.billable ? (
                                                        <Box w={'50%'} textAlign={'right'}>
                                                            <Text pt='2' fontSize='sm'>
                                                                Billable
                                                            </Text>
                                                        </Box>
                                                    ) : (
                                                        <Box w={'50%'} textAlign={'right'}>
                                                            <Text pt='2' fontSize='sm'>
                                                                Non-billable
                                                            </Text>
                                                        </Box>
                                                    )}
                                                    {taskInstance.in_progress ? (
                                                        <Box w={'50%'} textAlign={'right'}>
                                                            <Text pt='2' fontSize='sm'>
                                                                {convertSecondsToTime(inProgressTaskInstanceDurationWorked)}
                                                            </Text>
                                                        </Box>
                                                    ) : (
                                                        <>
                                                            <Box w={'50%'} textAlign={'right'}>
                                                                <Text pt='2' fontSize='sm'>
                                                                    {taskInstance.duration_worked}
                                                                </Text>
                                                            </Box>
                                                        </>
                                                    )}
                                                    {taskInstance.in_progress ? (
                                                        <Box w={'50%'} textAlign={'right'}>
                                                            <IconButton aria-label='Search database' size={'md'} icon={<FontAwesomeIcon icon={faPause} />} onClick={() => handleTaskInstanceStoppage(taskInstance.id)} />
                                                        </Box>
                                                    ) : (
                                                        <Box w={'50%'} textAlign={'right'}>
                                                            <IconButton aria-label='Search database' size={'md'} icon={<FontAwesomeIcon icon={faPlay} />} onClick={() => handleTaskInstanceContinuation(taskInstance.id)} />
                                                        </Box>
                                                    )}
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
                </>
            )}
        </>
    );
};

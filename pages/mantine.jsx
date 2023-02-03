import { Text, Title, Anchor, Container, Grid, Center,
         Image, Card, Group, Badge, Button, Stack } from "@mantine/core";

const Mantine = () => {
    return (
        <>
            <Anchor href="https://mantine.dev/" target="_blank">
                <Title align={"center"}>
                    Mantine
                </Title>
            </Anchor>
            <Container>
                <Text>I&apos;m a container, by default I&apos;m in the center.</Text>
            </Container>
            <br/>
            <Container fluid>
                <Text>I&apos;m a fluid container, I take more space!</Text>
            </Container>
            <br/>
            <Text>You can also have grids...</Text>
            <Grid>
                <Grid.Col span={4}>
                    <Image
                        radius="md"
                        src="https://images.unsplash.com/photo-1591362954553-32e679d4adcb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2921&q=80"
                        alt="random image"
                    />
                </Grid.Col>
                <Grid.Col span={4}>
                    <Image
                        radius="md"
                        src="https://images.unsplash.com/photo-1674821782079-e77a8e911118?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1775&q=80"
                        alt="random image"
                    />
                </Grid.Col>
                <Grid.Col span={4}>
                    <Image
                        radius="md"
                        src="https://thispersondoesnotexist.com/image"
                        alt="random image"
                    />
                </Grid.Col>
            </Grid>
            <br/>
            <Text>You have a grid grow to take all the space</Text>
            <Grid grow>
                <Grid.Col span={4}>
                    <Image
                        radius="md"
                        src="https://images.unsplash.com/photo-1672175263631-98dbe0e06370?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2970&q=80"
                        alt="random image"
                    />
                </Grid.Col>
                <Grid.Col span={4}>
                    <Image
                        radius="md"
                        src="https://images.unsplash.com/photo-1673697822947-9bb5faef1f26?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                        alt="random image"
                    />
                </Grid.Col>
                <Grid.Col span={4}>
                    <Image
                        radius="md"
                        src="https://images.unsplash.com/photo-1674573070648-640a3e57ccdf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80"
                        alt="random image"
                    />
                </Grid.Col>
                <Grid.Col span={4}>
                    <Image
                        radius="md"
                        src="https://images.unsplash.com/photo-1674571289827-c45050235e3a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                        alt="random image"
                    />
                </Grid.Col>
                <Grid.Col span={4}>
                    <Image
                        radius="md"
                        src="https://images.unsplash.com/photo-1674673243921-9e6ab580431f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1748&q=80"
                        alt="random image"
                    />
                </Grid.Col>
            </Grid>
            <Text>You can create cards</Text>
            <Container>
                <Card shadow="sm" p="lg" radius="md" withBorder>
                    <Card.Section>
                        <Image
                            src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                            height={160}
                            alt="Norway"
                        />
                    </Card.Section>

                    <Group position="apart" mt="md" mb="xs">
                        <Text weight={500}>Norway Fjord Adventures</Text>
                        <Badge color="pink" variant="light">
                            On Sale
                        </Badge>
                    </Group>

                    <Text size="sm" color="dimmed">
                        With Fjord Tours you can explore more of the magical fjord landscapes with tours and
                        activities on and around the fjords of Norway
                    </Text>

                    <Button variant="light" color="blue" fullWidth mt="md" radius="md">
                        Book classic tour now
                    </Button>
                </Card>
            </Container>
            <Text>You can also stack elements</Text>
            <Stack>
                <Image
                    radius="md"
                    src="https://images.unsplash.com/photo-1674551246022-15364ae56a7f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                    alt="random image"
                />
                <Image
                    radius="md"
                    src="https://images.unsplash.com/photo-1671967616401-cf8e28b8de4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                    alt="random image"
                />
                <Image
                    radius="md"
                    src="https://images.unsplash.com/photo-1674545187688-720f98297463?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2232&q=80"
                    alt="random image"
                />
            </Stack>
        </>
    );
}

export default Mantine;

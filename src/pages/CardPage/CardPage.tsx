import {ReactNode} from "react";
import {Container, SimpleGrid} from "@mantine/core";

interface CardPageProps {
    cards: ReactNode[];
}

const CardPage: React.FC<CardPageProps> = ({ cards }) => {
    return (
        <div className="page">
            <Container py="xl">
                <SimpleGrid cols={{base: 1, sm: 2}}>{cards}</SimpleGrid>
            </Container>
        </div>
    )
}

export default CardPage
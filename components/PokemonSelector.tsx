import { useCallback } from 'react';
import styled from 'styled-components';
import { useTypedSelector } from '../store/store';
import { useRouter } from 'next/router';

export const PokemonSelector: React.FC = () => {
  const allies = useTypedSelector(state => state.allies);
  const router = useRouter();

  const handleAllySelection = useCallback((id: number) => {
    router.push('/pokemon/:id', `/pokemon/${id}`, { shallow: true });
  }, [router]);

  return (
    <Container>
      {allies.map(ally => (
        <AllySelector key={ally.id} backgroundImage={ally.icon} onClick={() => handleAllySelection(ally.id)} />
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin: -1rem 2rem 0;
  padding: 0.25rem 0.5rem;
  background-color: rgba(255, 255, 255, 0.75);

  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 0 0 0.25rem 0.25rem;
`;

const AllySelector = styled.button<{ backgroundImage: string }>`
  width: 3rem;
  height: 3rem;
  background-color: transparent;
  background-image: url(${({ backgroundImage }) => backgroundImage});
  background-size: cover;
  border: none;
  appearance: none;
  -webkit-appearance: none;
  border-radius: 0.25rem;

  &:hover {
    background-color: rgba(0, 0, 0, 0.15);
  }
`;

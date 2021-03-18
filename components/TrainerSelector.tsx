import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { Trainer } from '../server/models/trainer';
import { Theme } from '../utils/theme';
import { setSelectedTrainer, setTrainerName } from '../store/trainer';
import { useTypedSelector } from '../store/rootReducer';
import { IconButton, TextInput } from './Layout';
import { faCheck, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

interface TrainerSelectorProps {
  trainer: Trainer;
}

export const TrainerSelector: React.FC<TrainerSelectorProps> = ({ trainer }) => {
  const dispatch = useDispatch();
  const selectedTrainerId = useTypedSelector(state => state.trainer.selectedTrainer);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTrainerName, setEditedTrainerName] = useState(trainer.name);

  const isActive = trainer.id === selectedTrainerId;

  const handleSetSelectedTrainer = useCallback((trainerId: number) => {
    dispatch(setSelectedTrainer(trainerId));
  }, [dispatch]);

  const handleEditButtonClick = useCallback(() => {
    if (isEditing) {
      setIsEditing(false);
      dispatch(setTrainerName(trainer.id, editedTrainerName))
    } else {
      setEditedTrainerName(trainer.name);
      setIsEditing(true);
    }
  }, [dispatch, isEditing, editedTrainerName, trainer.id]);

  const handleEditInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTrainerName(event.target.value);
  }, []);

  return (
    <Container
      key={trainer.id}
      active={isActive}
      onClick={() => handleSetSelectedTrainer(trainer.id)}
      tabIndex={0}
    >
      <NameRow>
        
      {isEditing ? (
        <EditInput
          isActive={isActive}
          defaultValue={editedTrainerName}
          onChange={handleEditInputChange}
        />
       ) : trainer.name}

        <EditButton
          isActive={isActive}
          icon={isEditing ? faCheck : faPencilAlt}
          onClick={handleEditButtonClick}
        />
      </NameRow>

      <TrainerPokemonCount>
        {(trainer.pokemon ?? []).length} Pokemon
      </TrainerPokemonCount>
    </Container>
  );
}


const TrainerPokemonCount = styled.div`
  position: absolute;
  display: flex;
  color: inherit;
  top: 0;
  right: 0;
  height: 2rem;
  padding: 0.25rem 2rem;
`;

const Container = styled.div<{ active: boolean }>`
  position: relative;
  height: 2rem;
  padding: 0.25rem 2rem;
  background: ${props => props.active ? '#333' : 'rgba(255, 255, 255, 0.5)' };
  color: ${props => props.active ? '#fff' : '#333'};
  border-radius: 2rem;
  overflow: hidden;
  cursor: pointer;

  & ${TrainerPokemonCount} {
    background-color: ${props => props.active && Theme.backgroundStripe};

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: -2rem;
      border-left: 1rem solid transparent;
      border-right: 1rem solid ${props => props.active ? Theme.backgroundStripe : 'transparent'};
      border-top: 2rem solid transparent;
    }
  }

  & + & {
    margin-top: 0.5rem;
  }
`;

const NameRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const EditButton = styled(IconButton)`
  margin-left: 0.5rem;

  & > div {
    background-color: ${({ isActive }) => isActive && '#666'};
  }

  & svg {
    font-size: 0.575rem;
  }
`;

const EditInput = styled(TextInput)`
  color: ${({ isActive }) => isActive && '#fff'};
  padding: 0 0.25rem;
  height: 100%;
`;

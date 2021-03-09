import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { DropdownTooltip } from '../components/DropdownTooltip';
import { Button, DropdownHeader, HealthBar, PokemonIcon, TextInput } from '../components/Layout';
import { LoadingIcon } from '../components/LoadingIcon';
import { getGenderColor, getGenderIcon } from '../components/PokemonNameBar';
import { useTypedSelector } from '../store/rootReducer';
import { createNewPokemon, createNewTrainer, fetchTrainers, setSelectedTrainer, setTrainerCampaign } from '../store/trainer';
import { calculateTotalHP } from '../utils/formula';
import { useOnMount } from '../utils/hooks';
import { calculateLevel } from '../utils/level';
import { Theme } from '../utils/theme';
import { Pokemon } from '../server/models/pokemon';
import { DefinitionLookahead } from '../components/DefinitionLookahead';

const TrainerPage = ({ displayName }) => {
  const router = useRouter();
  const isLoadingTrainers = useTypedSelector(state => state.trainer.isLoadingTrainers);
  const trainers = useTypedSelector(state => state.trainer.trainers);
  const selectedTrainerId = useTypedSelector(state => state.trainer.selectedTrainer);
  const selectedTrainer = selectedTrainerId ? trainers.find(trainer => trainer.id === selectedTrainerId) : null;
  
  const dispatch = useDispatch();

  const [showNewTrainerEditor, setShowNewTrainerEditor] = useState(false);
  const [newTrainerName, setNewTrainerName] = useState('');

  const toggleNewTrainerEditor = useCallback((event: Event) => {
    event.stopPropagation();
    setNewTrainerName('');
    setShowNewTrainerEditor(!showNewTrainerEditor);
  }, [showNewTrainerEditor]);

  const handleSetNewTrainerName = useCallback(event => setNewTrainerName(event.target.value), []);

  const handleSetSelectedTrainer = useCallback((trainerId: number) => {
    dispatch(setSelectedTrainer(trainerId));
  }, [dispatch]);

  const submitNewTrainer = useCallback(() => {
    dispatch(createNewTrainer(newTrainerName));
    setShowNewTrainerEditor(false);
  }, [dispatch, newTrainerName]);

  const submitNewPokemon = useCallback(() => {
    dispatch(createNewPokemon(selectedTrainerId));
  }, [dispatch, selectedTrainerId]);

  const handleSetSelectedCampaign = useCallback(({ value, label }) => {
    dispatch(setTrainerCampaign(selectedTrainerId, value, label));
  }, [dispatch, selectedTrainerId]);

  const navigateToPokemon = useCallback((pokemon: Pokemon) => {
    router.push(`/pokemon/${pokemon.id}`);
  }, [router]);

  useOnMount(() => {
    dispatch(fetchTrainers());
  });

  return isLoadingTrainers ?  <LoadingIcon /> : (
    <Container>
      <LeftPanelBackground />
      <div>
        <PageTitle>
          My Trainers
          
          <AddTrainerContainer>
            <AddTrainerButton onClick={toggleNewTrainerEditor}>New Trainer</AddTrainerButton>
            <DropdownTooltip visible={showNewTrainerEditor} onVisibilityChange={setShowNewTrainerEditor}>
              <NewTrainerDropdownContent>
                <DropdownHeader>Name</DropdownHeader>
                <DropdownHeader/>
                <div>
                  <NewTrainerNameInput onChange={handleSetNewTrainerName} />
                </div>
                <div>
                  <AddNewTrainerButton onClick={submitNewTrainer} disabled={newTrainerName.length === 0}>
                    Add
                  </AddNewTrainerButton>
                </div>
              </NewTrainerDropdownContent>
            </DropdownTooltip>
          </AddTrainerContainer>
        </PageTitle>

        <TrainerList>
          {trainers.map(trainer => (
            <TrainerSelector
              key={trainer.id}
              active={trainer.id === selectedTrainerId}
              onClick={() => handleSetSelectedTrainer(trainer.id)}
              tabIndex={0}
            >
              {trainer.name}

              <TrainerPokemonCount>
                {(trainer.pokemon ?? []).length} Pokemon
              </TrainerPokemonCount>
            </TrainerSelector>
          ))}
        </TrainerList>
      </div>
      {selectedTrainer && (
        <PokemonList>
          <CampaignSelector>
            Campaign

            <CampaignSelectorWrapper>
              <DefinitionLookahead
                path='reference/campaigns'
                onChange={handleSetSelectedCampaign}
                value={selectedTrainer?.campaign ? {
                  value: selectedTrainer?.campaign.id,
                  label: selectedTrainer?.campaign.name,
                } : null}
                placeholder="Enter the name of a campaign..."
              />
            </CampaignSelectorWrapper>
          </CampaignSelector>
          {selectedTrainer?.pokemon.map(pokemon => (
            <PokemonCell key={`${selectedTrainerId}_${pokemon.id}`} onClick={() => navigateToPokemon(pokemon)}>
              <PokemonCellIcon species={pokemon.species} />
              <PokemonDescriptionContainer>
                <PokemonNameRow>
                  {pokemon.name}
                  <GenderIcon color={getGenderColor(pokemon.gender)}>
                    <FontAwesomeIcon icon={getGenderIcon(pokemon.gender)} size="sm"/>
                  </GenderIcon>
                </PokemonNameRow>
                <PokemonHealthBar pokemon={pokemon} />
                <PokemonStatRow>
                  <div>
                    {pokemon.currentHealth}/{calculateTotalHP(pokemon)}
                  </div>
                  <div>Lv.&nbsp;{calculateLevel(pokemon.experience)}</div>
                </PokemonStatRow>
              </PokemonDescriptionContainer>
            </PokemonCell>
          ))}
          <NewPokemonCell onClick={submitNewPokemon}>Create new Pokémon</NewPokemonCell>
        </PokemonList>
      )}
    </Container>
 );
};

export async function getServerSideProps(ctx) {
  if (!ctx.req.isAuthenticated()) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }

  if (!ctx.req.user?.isAuthorized) {
    return {
      redirect: {
        permanent: false,
        destination: '/unauthorized',
      },
    };
  }

  return {
    props: {},
  };
}

export default TrainerPage;

const Container = styled.div`
  position: relative;
  display: flex;
  width: 100vw;
  height: 100vh;
  flex-direction: row;
`;

const LeftPanelBackground = styled.div`
  position: fixed;
  top: 0;
  left: -6rem;
  width: calc(50% + 6rem);
  height: 100%;
  background-color: ${Theme.backgroundStripe};
  clip-path: polygon(0 0, 100% 0%, calc(100% - 8rem) 100%, 0% 100%);
  z-index: -1;
  pointer-events: none;
  
  &::before {
    content: '';
    position: absolute;
    right: 4rem;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.25);
    clip-path: polygon(0 0, 100% 0%, calc(100% - 8rem) 100%, 0% 100%);
    z-index: -2;
  }
`;

const PageTitle = styled.div`
  display: flex;
  width: 36rem;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  font-size: 2rem;
  font-weight: 700; 
  margin-top: 1rem;
  padding: 0.25rem 1rem;
  background-color: #333;
  margin-bottom: 1rem;
`;

const AddTrainerButton = styled(Button)`
  background-color: #fff;
  color: #333;
  font-size: 1rem;

  &:hover:not(:disabled) {
    background-color: #ccc;
  }
`;

const AddTrainerContainer = styled.div`
  position: relative;
  font-size: 1rem;
`;

const NewTrainerDropdownContent = styled.div`
  display: grid;
  grid-template-columns: 15rem max-content;

  & > div {
    padding: 0 0.5rem;
  }
`;

const NewTrainerNameInput = styled(TextInput)`
  width: 100%;
  border-bottom: 1px solid #333;
`;

const AddNewTrainerButton = styled(Button)`
  height: 1.75rem;
  padding: 0.5rem 2rem;
  border-radius: 0.875rem;
`;

const TrainerList = styled.ul`
  padding: 0 1rem;
  margin: 0.5rem 0;
  overflow-y: auto;
`;

const TrainerPokemonCount = styled.div`
  position: absolute;
  display: flex;
  color: inherit;
  top: 0;
  right: 0;
  height: 2rem;
  padding: 0.25rem 2rem;
`;

const TrainerSelector = styled.div<{ active: boolean }>`
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

const PokemonList = styled.div`
  position: absolute;
  left: calc(50% + 5rem);
  top: 0;
  padding: 5rem calc(50% - 26rem) 1rem 1rem;
  overflow-y: auto;
  overflow-x: visible;
`;

const PokemonCell = styled.button`
  display: flex;
  width: 20rem;
  height: 4rem;
  flex-direction: row;
  box-shadow: ${Theme.dropShadow};
  border: none;
  background-color: #fff;
  border-radius: 2rem;
  font-size: 1rem;
  font-family: inherit;
  font-weight: 700;
  cursor: pointer;
  
  & + & {
    margin-top: 1rem;
  }

  &:hover {
    background-color: #ddd;
  }
`;

const PokemonCellIcon = styled(PokemonIcon)`
  margin: 9.5px 0.5rem;
`;

const PokemonDescriptionContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  padding: 0.5rem 0 0.5rem 0.5rem;
  align-self: stretch;
`;


const PokemonNameRow = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-right: 4rem;
`;

const GenderIcon = styled.div<{ color: string }>`
  display: flex;
  width: 1rem;
  height: 1rem;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  color: #fff;
  background-color: ${props => props.color};

  & > svg {
    font-size: 0.625rem;
  }
`;

const NewPokemonCell = styled(PokemonCell)`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed #aaa;
`;

const PokemonStatRow = styled.div`
  display: flex;
  width: 100%;
  padding-right: 1rem;
  flex-direction: row;
  justify-content: space-between;
`;

const PokemonHealthBar = styled(HealthBar)`
  width: calc(100% - 4rem);
`;

const CampaignSelector = styled.div`
  position: absolute;
  display: flex;
  top: 1rem;
  width: calc(50vw - 6rem);
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 700; 
  padding: 0.25rem 1rem;
  background-color: #333;
  margin-bottom: 1rem;
`;

const CampaignSelectorWrapper = styled.div`
  min-width: 0;
  flex-grow: 1;
  align-self: stretch;
  padding-left: 1rem;
  font-weight: 400;
  font-size: 1rem;
  color: #000;
`;
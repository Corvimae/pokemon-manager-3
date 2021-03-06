import { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { calculateExperienceToNextLevel, calculatePercentageToNextLevel, calculateLevel } from '../utils/level';
import { setPokemonNature, setPokemonType, setPokemonSpecies, setPokemonExperience, setPokemonLoyalty, setPokemonTrainer, saveGMNotes, setSpentTutorPoints, setBonusTutorPoints, deletePokemon } from '../store/pokemon';
import { TypeIndicator } from './TypeIndicator';
import { StatValue, StatKey, StatRow, StatList, StatRowDivider, TextInput, TypeList } from './Layout';
import { useSpecialEvasions, useSpeedEvasions, usePhysicalEvasions } from '../utils/formula';
import { SelectablePokemonValue } from './SelectablePokemonValue';
import { AbilityList } from './AbilityList';
import { TypeSelector } from './TypeSelector';
import { RichTextEditor } from './RichTextEditor';
import { Theme } from '../utils/theme';
import { TypeName, useCombinedDefensiveEffectivenesses } from '../utils/pokemonTypes';
import { useTypedSelector } from '../store/rootReducer';
import { HeldItemList } from './HeldItemList';
import { RulebookSpecies } from '../server/models/rulebookSpecies';
import { Gender } from '../utils/types';
import { router } from '../server/api/trainer/routes';

const ANIMATED_SPRITE_BASE_URL = "https://play.pokemonshowdown.com/sprites/ani/";

function getSpeciesAnimatedSpriteURL(species: RulebookSpecies, gender: Gender): string {
  let spriteName = species.name.toLowerCase().replace(/-/g, '');

  if (species.animatedSprite) {
    return species.animatedSprite;
  } else if (species.isMega) {
    spriteName = spriteName.replace('mega ', '') + '-mega';
  } else if (species.isGenderDimorphic && gender === 'female') {
    spriteName += '-f';
  }

  return `${ANIMATED_SPRITE_BASE_URL}${spriteName}.gif`;

} 

export const PokemonDataTable = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const mobileMode = useTypedSelector(store => store.pokemon.mobileMode);
  const editMode = useTypedSelector(store => store.pokemon.editMode);
  const pokemon = useTypedSelector(store => store.pokemon.data);
  const isUserGM = useTypedSelector(store => store.pokemon.isUserGM);

  const showGMEditor = editMode && isUserGM;
  
  const physicalEvasions = usePhysicalEvasions();
  const specialEvasions = useSpecialEvasions();
  const speedEvasions = useSpeedEvasions();
  const defenses = useCombinedDefensiveEffectivenesses();
  const level = calculateLevel(pokemon.experience);
  const totalTutorPoints = 1 + Math.floor(level/5) + pokemon.bonusTutorPoints;

  const spentTutorPoints = useMemo(() => (
    pokemon.edges.reduce((acc, item) => acc + item.cost * item.PokemonEdge.ranks, pokemon.spentTutorPoints)
  ), [pokemon.edges, pokemon.spentTutorPoints]);

  const handleChangeType1 = useCallback(name => {
    dispatch(setPokemonType(pokemon.id, name, pokemon.type2 as TypeName));
  }, [dispatch, pokemon.id,pokemon.type2]);

  const handleChangeType2 = useCallback(name => {
    dispatch(setPokemonType(pokemon.id, pokemon.type1 as TypeName, name));
  }, [dispatch, pokemon.id, pokemon.type1]);

  const handleChangeNature = useCallback(({ value }) => {
    dispatch(setPokemonNature(pokemon.id, value));
  }, [dispatch, pokemon.id]);

  const handleChangeSpecies = useCallback(({ value }) => {
    dispatch(setPokemonSpecies(pokemon.id, value));
  }, [dispatch, pokemon.id]);

  const handleChangeExperience = useCallback(event => {
    dispatch(setPokemonExperience(pokemon.id, event.target.value));
  }, [dispatch, pokemon.id]);

  const handleChangeLoyalty = useCallback(event => {
    dispatch(setPokemonLoyalty(pokemon.id, event.target.value));
  }, [dispatch, pokemon.id]);

  const handleChangeTrainer = useCallback(({ value }) => {
    dispatch(setPokemonTrainer(pokemon.id, value));
  }, [dispatch, pokemon.id]);

  const handleChangeBonusTutorPoints = useCallback(event => {
    dispatch(setBonusTutorPoints(pokemon.id, event.target.value));
  }, [dispatch, pokemon.id]);

  const handleChangeSpentTutorPoints = useCallback(event => {
    dispatch(setSpentTutorPoints(pokemon.id, event.target.value));
  }, [dispatch, pokemon.id]);

  const handleSaveGMNotes = useCallback(notes => {
    dispatch(saveGMNotes(pokemon.id, notes));
  }, [dispatch, pokemon.id]);

  const handleDeletePokemon = useCallback(() => {
    dispatch(deletePokemon(pokemon.id));

    router.push('/');
  }, [dispatch, pokemon.id]);

  return (
    <StatTable isActiveMobileMode={mobileMode === 'data'}>
      <StatRow>
        <StatKey>Trainer</StatKey>
        <SelectablePokemonValue
          id={pokemon.trainer.id}
          value={pokemon.trainer.name}
          path={`reference/campaigns/${pokemon.trainer.campaignId}/trainers`}
          onChange={handleChangeTrainer}
          requireGMToEdit
          editingDisabled={pokemon.trainer.campaignId === null}
        />
      </StatRow>
      <StatRow>
        <StatKey>Species</StatKey>
        <SelectablePokemonValue
          id={pokemon.species.id}
          value={pokemon.species.name}
          path='reference/species'
          onChange={handleChangeSpecies}
        />
      </StatRow>
      <StatRow>
        <StatKey>Type</StatKey>
        <TypeIcons>
          <TypeSelector value={pokemon.type1} onSelect={name => handleChangeType1(name)} />
          <TypeSelector value={pokemon.type2} onSelect={name => handleChangeType2(name)} />
        </TypeIcons>
      </StatRow>
      <StatRowDivider />
      <StatRow>
        <StatKey>Experience Points</StatKey>
        <StatValue>
          {!editMode && pokemon.experience}
          {editMode && (
            <RowValueNumericInput type="number" onChange={handleChangeExperience} defaultValue={pokemon.experience} />
          )}
        </StatValue>
      </StatRow>
      <StatRow>
        <StatKey>Exp. to next level</StatKey>
        <PointsToLevelContainer>
          <PointsToLevel>{calculateExperienceToNextLevel(pokemon.experience)}</PointsToLevel>
          <PointsToLevelBar percentage={calculatePercentageToNextLevel(pokemon.experience)} />
        </PointsToLevelContainer>
      </StatRow>
      <StatRow>
        <StatKey>Tutor Points</StatKey>
        <TutorPointsValueCell>
          {totalTutorPoints - spentTutorPoints}&nbsp;/&nbsp;{totalTutorPoints}
          {editMode && (
            <ManualTutorPoints>
              <TutorPointHeader>Bonus</TutorPointHeader>
              <TutorPointHeader>Misc.&nbsp;Used</TutorPointHeader>
              <div>
                <TutorPointValueInput
                  type="number"
                  onChange={handleChangeBonusTutorPoints}
                  defaultValue={pokemon.bonusTutorPoints}
                />
              </div>
              <div>
                <TutorPointValueInput
                  type="number"
                  onChange={handleChangeSpentTutorPoints}
                  defaultValue={pokemon.spentTutorPoints}
                />
              </div>
            </ManualTutorPoints>
          )}
        </TutorPointsValueCell>
      </StatRow>
      {pokemon.loyalty !== null && (
        <StatRow>
          <StatKey>Loyalty</StatKey>
          <StatValue>
            {!showGMEditor && pokemon.loyalty}
            {showGMEditor && (
              <RowValueNumericInput type="number" onChange={handleChangeLoyalty} defaultValue={pokemon.loyalty} />
            )}
          </StatValue>
        </StatRow>
      )}
      <StatRowDivider />
      <StatRow>
        <StatKey>Nature</StatKey>
        <SelectablePokemonValue
          id={pokemon.nature.id}
          value={pokemon.nature.name}
          path='reference/natures'
          onChange={handleChangeNature}
        />
      </StatRow>
      <StatRow>
        <StatKey>Abilities</StatKey>
        <AbilityList />
      </StatRow>
      <StatRow>
        <StatKey>Held Items</StatKey>
        <HeldItemList />
      </StatRow>
      <StatRowDivider />
      <StatRow>
        <StatKey>Physical Evasion</StatKey>
        <StatValue>{physicalEvasions}</StatValue>
      </StatRow>
      <StatRow>
        <StatKey>Special Evasion</StatKey>
        <StatValue>{specialEvasions}</StatValue>
      </StatRow>
      <StatRow>
        <StatKey>Speed Evasion</StatKey>
        <StatValue>{speedEvasions}</StatValue>
      </StatRow>
      <StatRowDivider />
      <StatRow>
        <StatKey>STAB Modifier</StatKey>
        <StatValue>
          {Math.floor(calculateLevel(pokemon.experience) / 5)}
        </StatValue>
      </StatRow>
      <StatRowDivider />
      <StatRow>
        <StatKey>Weaknesses</StatKey>
        <TypeList>
          {defenses.x4.map(weakness => (
            <TypeIndicator key={weakness} name={weakness} multiplier={4} />
          ))}
          {defenses.x2.map(weakness => (
            <TypeIndicator key={weakness} name={weakness} multiplier={2} />
          ))}
        </TypeList>
      </StatRow>				
      <StatRow>
        <StatKey>Resistances</StatKey>
        <TypeList>
          {defenses.fourth.map(resistance => (
            <TypeIndicator key={resistance} name={resistance} multiplier={0.25} />
          ))}
          {defenses.half.map(resistance => (
            <TypeIndicator key={resistance} name={resistance} multiplier={0.5} />
          ))}
        </TypeList>
      </StatRow>
      <StatRow>
        <StatKey>Immunities</StatKey>
        <TypeList>
          {defenses.x0.map(resistance => (
            <TypeIndicator key={resistance} name={resistance} multiplier={0} />
          ))}
        </TypeList>
      </StatRow>
      <StatRowDivider />
      {!showGMEditor && (
        <PokemonImage>
          <img src={getSpeciesAnimatedSpriteURL(pokemon.species, pokemon.gender)} />
        </PokemonImage>
      )}
      {showGMEditor && (
        <>
          <StatRow>
            <StatKey>GM Notes</StatKey>
            <GMNotesEditorContainer>
              <RichTextEditor defaultValue={pokemon.gmNotes} onSave={handleSaveGMNotes} />
            </GMNotesEditorContainer>
          </StatRow>
        </>
      )}
      {editMode && (
        <DeleteButton onClick={handleDeletePokemon}>
          Delete this Pok??mon
        </DeleteButton>
      )}
    </StatTable>
  );
};

const StatTable = styled(StatList)<{ isActiveMobileMode: boolean }>`
  @media screen and (max-width: ${Theme.mobileThreshold}) {
    display: ${({ isActiveMobileMode }) => !isActiveMobileMode && 'none'};
    min-width: 100vw;
    grid-template-columns: max-content 1fr;
  }
`;

const PointsToLevelContainer = styled(StatValue)`
  flex-direction: column;
`;

const PointsToLevel = styled.div`
  text-align: right;
`;

const PointsToLevelBar = styled.div<{ percentage: number }>`
  position: relative;
  height: 0.25rem;
  width: 100%;
  background-color: #606060;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: ${props => props.percentage}%;
    height: 100%;
    background-color: #13a8b0;
  }
`;

const TypeIcons = styled(StatValue)`
  & > ${TypeIndicator}:first-child {
    margin-right: 0.25rem;
  }
`;

const RowValueNumericInput = styled(TextInput)`
  width: 100%;
  border-bottom: 1px solid #333;
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const PokemonImage = styled.div`
  display: flex;
  height: 10rem;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
  grid-column: 1 / -1;
  background-image: url("https://em-uploads.s3.amazonaws.com/profilebg/312687.png");
  background-size: cover;
  border: 0.25rem solid rgba(0, 0, 0, 0.75);
  overflow: hidden;
  & > img {
    margin-bottom: 1.5rem;
  }
`;

const GMNotesEditorContainer = styled(StatValue)`
  position: relative;
  height: 10rem;
  width: 30rem;
  padding: 0;

  & > div {
    width: 100%;
  }

  @media screen and (max-width: ${Theme.mobileThreshold}) {
    width: auto;
  }
`;

const TutorPointsValueCell = styled(StatValue)`
  align-items: center;
`;

const ManualTutorPoints = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 4rem);
  margin-left: auto;
  
  & > div:nth-of-type(2n) {
    margin-left: 0.25rem;
  }
`;

const TutorPointHeader = styled.div`
  color: #666;
  font-size: 0.825rem;
  font-weight: 700;
  text-align: center;
`;

const TutorPointValueInput = styled(RowValueNumericInput)`
  width: 100%;
  padding: 0;
  text-align: center;
`;

const DeleteButton = styled.button`
  display: flex;
  grid-column: 1 / -1;
  justify-content: center;
  align-items: center;
  background-color: #dd7777;
  border: 1px solid #610606;
  font-size: 1rem;
  font-family: inherit;
  padding: none;
  margin: 0.5rem 0.5rem;
  color: #610606;
  font-weight: 700;
  cursor: pointer;
  
  &:hover {
    background-color: #eeb2b2;
  }
`;
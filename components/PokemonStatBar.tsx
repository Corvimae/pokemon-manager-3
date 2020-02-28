import styled from 'styled-components';
import { useTypedSelector, bumpCombatStage, setHealth, setBaseStat, setAddedStat } from '../store/store';
import { useCalculatedAttackStat, useCalculatedDefenseStat, useCalculatedSpecialAttackStat, useCalculatedSpecialDefenseStat, useCalculatedSpeedStat, useTotalHP } from '../utils/formula';
import { useDispatch } from 'react-redux';
import { useCallback, useState } from 'react';
import { CombatStages } from '../utils/types';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { IconButton, Button, NumericInput, DropdownHeader } from './Layout';
import { Theme } from '../utils/theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface StatEditorProps { 
  stat: keyof CombatStages | "hp";
}

const StatEditor: React.FC<StatEditorProps> = ({ stat }) => {
  const dispatch = useDispatch();
  const pokemonId = useTypedSelector(state => state.pokemon.id);
  const { base, added } = useTypedSelector(state => state.pokemon.stats);

  const handleChangeBaseStat = useCallback(event => {
    dispatch(setBaseStat(pokemonId, stat, event.target.value));
  }, [dispatch, stat, pokemonId]);

  const handleChangeAddedStat = useCallback(event => {
    dispatch(setAddedStat(pokemonId, stat, event.target.value));
  }, [dispatch, stat, pokemonId]);

  return (
    <StatEditContainer>
      <DropdownHeader>Base</DropdownHeader>
      <div />
      <DropdownHeader>Added</DropdownHeader>
      <NumericInput type="number" onChange={handleChangeBaseStat} defaultValue={base[stat]} />
      <StatEditPlus>
        <FontAwesomeIcon icon={faPlus} size="xs" />
      </StatEditPlus>
      <NumericInput type="number" onChange={handleChangeAddedStat} defaultValue={added[stat]} />
    </StatEditContainer>
  );
};
 
interface CombatStageModifierProps { 
  stat: keyof CombatStages;
}

const CombatStageModifier: React.FC<CombatStageModifierProps> = ({ stat }) => {
  const dispatch = useDispatch();
  const editMode = useTypedSelector(state => state.editMode);
  const combatStages = useTypedSelector(state => state.combatStages);

  const handleBumpCombatStage = useCallback((amount: number) => {
    dispatch(bumpCombatStage(stat, amount));
  }, [dispatch, stat]);

  return (
    <CombatStageCell>
      {!editMode && (
        <>
          <CombatStageButton icon={faMinus} onClick={() => handleBumpCombatStage(-1)} />
          <CombatStageValue>
            {combatStages[stat]}
          </CombatStageValue>
          <CombatStageButton icon={faPlus} onClick={() => handleBumpCombatStage(1)} />
        </>
      )}
      {editMode && <StatEditor stat={stat} />}
    </CombatStageCell>
  )
}
export const PokemonStatBar = () => {
  const dispatch = useDispatch();
  const editMode = useTypedSelector(state => state.editMode);
  const pokemonId = useTypedSelector(state => state.pokemon.id);
  const stats = useTypedSelector(store => store.pokemon.stats);
  const currentHealth = useTypedSelector(store => store.currentHealth);

  const [modifyHealthValue, setModifyHealthValue] = useState(1);

  const totalHealth = useTotalHP();
  const attack = useCalculatedAttackStat();
  const defense = useCalculatedDefenseStat();
  const specialAttack = useCalculatedSpecialAttackStat();
  const specialDefense = useCalculatedSpecialDefenseStat();
  const speed = useCalculatedSpeedStat();

  const updateHealth = useCallback((value: number) => {
    dispatch(setHealth(pokemonId, value));
  }, [dispatch, pokemonId]);

  return (
    <Container>
      <Title>HP</Title>
      <Title>Attack</Title>
      <Title>Defense</Title>
      <Title>Sp. Attack</Title>
      <Title>Sp. Defense</Title>
      <Title>Speed</Title>
      <StatTotal>
        <div>
          <CurrentHealth>{currentHealth}&nbsp;</CurrentHealth>
          <TotalHealth>/&nbsp;{totalHealth}</TotalHealth>
        </div>
        <StatCalculation>({stats.base.hp} + {stats.added.hp})</StatCalculation>
      </StatTotal>
      <StatTotal>
        <TotalValue>{attack}</TotalValue>
        <StatCalculation>({stats.base.attack} + {stats.added.attack})</StatCalculation>
      </StatTotal>
      <StatTotal>
        <TotalValue>{defense}</TotalValue>
        <StatCalculation>({stats.base.defense} + {stats.added.defense})</StatCalculation>
      </StatTotal>
      <StatTotal>
        <TotalValue>{specialAttack}</TotalValue>
        <StatCalculation>({stats.base.spattack} + {stats.added.spattack})</StatCalculation>
      </StatTotal>
      <StatTotal>
        <TotalValue>{specialDefense}</TotalValue>
        <StatCalculation>({stats.base.spdefense} + {stats.added.spdefense})</StatCalculation>
      </StatTotal>
      <StatTotal>
        <TotalValue>{speed}</TotalValue>
        <StatCalculation>({stats.base.speed} + {stats.added.speed})</StatCalculation>
      </StatTotal>
      <HealthCell>
        {!editMode && (
          <>
            <AddSubtractHealthButtons>
              <CombatStageButton icon={faMinus} onClick={() => updateHealth(currentHealth - modifyHealthValue)}/>
              <HealthModifyInput
                type="number"
                onChange={event => setModifyHealthValue(Number(event.target.value))}
                defaultValue={modifyHealthValue}
              /> 
              <CombatStageButton icon={faPlus} onClick={() => updateHealth(currentHealth + modifyHealthValue)}/>
            </AddSubtractHealthButtons>
            <HealthCellDropdown>
              <HealthModifyButton onClick={() => updateHealth(modifyHealthValue)}>
                Set health to value
              </HealthModifyButton>
              <HealthModifyButton  onClick={() => updateHealth(totalHealth)}>
                Heal to full
              </HealthModifyButton>
            </HealthCellDropdown>
          </>
        )}
        {editMode && <StatEditor stat="hp" />}
      </HealthCell>
      <CombatStageModifier stat="attack" />
      <CombatStageModifier stat="defense" />
      <CombatStageModifier stat="spattack" />
      <CombatStageModifier stat="spdefense" />
      <CombatStageModifier stat="speed" />
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: grid;
  width: max-content;
  grid-template-columns: repeat(6, max-content);
  height: max-content;
  box-shadow: ${Theme.dropShadow};
  z-index: 1;

  & > div {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0.25rem 0.5rem;
  }
`;

const Title = styled.div`
  && {
    background-color: #dadada;
    font-weight: 700;
  }
`;

const StatTotal = styled.div`
  && {
    display: flex;
    flex-direction: column;
    background-color: #fff;
  }
`;

const StatCalculation = styled.div`
  margin-top: 0.125rem;
  font-size: 0.75rem;
  color: #666;
  font-style: italic;
`;

const CombatStageButton = styled(IconButton)`
  & > div {
    width: 1rem;
    height: 1rem;
  }

  &&& svg {
    font-size: 0.5rem;
    width: 0.75rem;
  }
`;

const CombatStageCell = styled.div`
  background-color: #fff;

`;

const CombatStageValue = styled.span`
  font-size: 1.25rem;
  font-weight: bold;
  width: 2rem;
  text-align: center;
  font-variant-numeric: tabular-nums;
`;

const HealthCellDropdown = styled.div`
  position: absolute;
  display: none;
  top: 100%;
  left: 0;
  width: max-content;
  padding: 0.5rem;
  background-color: #fff;
  flex-direction: column;
  box-shadow: 0 0.5rem 1rem 0 rgba(0, 0, 0, 0.1);
`;

const HealthCell = styled.div`
  position: relative;
  display: flex;
  min-width: max-content;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  overflow: visible;

  &:hover ${HealthCellDropdown} {
    display: flex;
  }
`;

const AddSubtractHealthButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const HealthModifyButton = styled(Button)`
  font-size: 0.75rem;
  min-width: max-content;

  &:not(:last-child) {
    margin-bottom: 0.25rem;
  }
`;

const HealthModifyInput = styled(NumericInput)`
  width: 3rem;
  margin: 0 0.25rem;
`;

const CurrentHealth = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
`;

const TotalHealth = styled.span`
  color: #666;
  font-size: 0.875rem;
`;

const StatEditContainer = styled.div`
  display: grid;
  grid-template-columns: 2.5rem max-content 2.5rem;

  & ${DropdownHeader} {
    margin: 0;
  }
`;

const StatEditPlus = styled.div`
  margin: 0 0.25rem;
  
  & svg {
    color: #999;
  }
`;

const TotalValue = styled.div`
  font-weight: 700;
`;
import styled from 'styled-components';
import { StatValue } from './Layout';
import { useCallback } from 'react';
import { DefinitionLookahead } from './DefinitionLookahead';
import { useTypedSelector } from '../store/rootReducer';

interface SelectablePokemonValueProps {
  id: number;
  value: string;
  path: string;
  onChange: (selection: { label: string, value: number}) => void;
  onClick?: () => void;
  requireGMToEdit?: boolean;
  editingDisabled?: boolean;
  className?: string;
}

export const SelectablePokemonValue: React.FC<SelectablePokemonValueProps> = ({ id, value, path, onChange, onClick, requireGMToEdit, editingDisabled, className }) => {
  const hasEditPermission = useTypedSelector(state => state.pokemon.isUserGM) || !requireGMToEdit;
  const editMode = useTypedSelector(state => state.pokemon.editMode) && hasEditPermission;

  const handleOnClick = useCallback(() => {
    if (!editMode) onClick?.();
  }, [editMode, onClick]);

  return (
    <Container className={className} onClick={handleOnClick}>
      {editMode && !editingDisabled && (
        <DefinitionLookahead
          path={path}
          onChange={onChange}
          defaultId={id}
          defaultLabel={value}
        />
      )}
      {(!editMode || editingDisabled) && value}
    </Container>
  );
};

const Container = styled(StatValue)`
  & > div {
    width: 100%;
    font-size: 0.875rem;
  }
`;
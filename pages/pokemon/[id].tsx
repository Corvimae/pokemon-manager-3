import { useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useTypedSelector, loadData, loadTypeIds, loadAllies } from '../../store/store';
import { useDispatch } from 'react-redux';
import { PokemonDataTable } from '../../components/PokemonDataTable';
import { PokemonStatBar } from '../../components/PokemonStatBar';
import { Theme } from '../../utils/theme';
import { PokemonNameBar } from '../../components/PokemonNameBar';
import { PokemonMoveList } from '../../components/PokemonMoveList';
import { DetailsSidebar } from '../../components/DetailsSidebar';
import { useOnMount } from '../../utils/hooks';
import { PokemonSelector } from '../../components/PokemonSelector';
import { LoadingIcon } from '../../components/LoadingIcon';

const PokemonViewer = () => {
  const router = useRouter();
  const pokemon = useTypedSelector(store => store.pokemon);

  const dispatch = useDispatch();
  
  useOnMount(() => {
    dispatch(loadTypeIds());
  });

  useEffect(() => {
    if(router.query.id) {
      dispatch(loadData(Number(router.query.id)));
      dispatch(loadAllies(Number(router.query.id)));
    }
  }, [router.query.id])

  return pokemon ? (
    <Container>
      <LeftPanel>
        <LeftPanelBackground />
        <TopContent>
          <PokemonNameBar />
          <PokemonSelector />
        </TopContent>
        <LeftAlignedContent>
          <PokemonDataTable />
          <MiddleContent>
            <PokemonStatBar />
            <PokemonMoveList />
          </MiddleContent>
        </LeftAlignedContent>
      </LeftPanel>
      <DetailsSidebar />
    </Container>
  ) : <LoadingIcon />;
}

export default PokemonViewer;

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const TopContent = styled.div`
  display: flex;
  flex-direction: row;
`;

const LeftPanel = styled.div`
  position: relative;
  display: flex;
  height: 100vh;
  width: 40rem;
  flex-direction: column;
  padding: 1rem 6rem 1rem 0;
  overflow: visible;
`;

const LeftPanelBackground = styled.div`
  position: absolute;
  top: 0;
  left: -6rem;
  width: calc(100% + 6rem);
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

const LeftAlignedContent = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 1rem;
`;  

const MiddleContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
`;
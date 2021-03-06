import { useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { loadData, setMobileMode } from '../../store/pokemon';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiceD20, faFistRaised, faScroll, faSync } from '@fortawesome/free-solid-svg-icons';
import { MobileMode } from '../../utils/types';
import { useTypedSelector } from '../../store/rootReducer';

const PokemonViewer = () => {
  const router = useRouter();
  const pokemon = useTypedSelector(store => store.pokemon.data);

  const dispatch = useDispatch();

  useEffect(() => {
    if(router.query.id) dispatch(loadData(Number(router.query.id)));
  }, [router.query.id])
  
  const handleSetMobileMode = useCallback((mode: MobileMode) => {
    dispatch(setMobileMode(mode));
  }, [dispatch]);

  return pokemon ? (
    <Container>
      <LeftPanel>
        <LeftPanelBackground />
        <TopContent>
          <PokemonNameBar />
          <PokemonSelector />
        </TopContent>
        <MobileModeSelector>
          <MobileModeButton onClick={() => handleSetMobileMode('data')}>
            <FontAwesomeIcon icon={faScroll} size="2x" />
          </MobileModeButton>
          <MobileModeButton onClick={() => handleSetMobileMode('stats')}>
            <FontAwesomeIcon icon={faDiceD20} size="2x" />
          </MobileModeButton>
          <MobileModeButton onClick={() => handleSetMobileMode('moves')}>
            <FontAwesomeIcon icon={faFistRaised} size="2x" />
          </MobileModeButton>
          <MobileModeButton onClick={() => handleSetMobileMode('allies')}>
            <FontAwesomeIcon icon={faSync} size="2x" />
          </MobileModeButton>
        </MobileModeSelector>
        <LeftAlignedContent>
          <PokemonSelector mobile />

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

export async function getServerSideProps(ctx) {
  if (!ctx.req.isAuthenticated()) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }

  return {
    props: {},
  };
}

export default PokemonViewer;

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const TopContent = styled.div`
  display: flex;
  flex-direction: row;

  @media screen and (max-width: ${Theme.mobileThreshold}) {
    flex-shrink: 0;
    flex-direction: column;
  }
`;

const LeftPanel = styled.div`
  position: relative;
  display: flex;
  height: 100vh;
  width: 40rem;
  flex-direction: column;
  padding: 1rem 6rem 1rem 0;
  overflow: visible;

  @media screen and (max-width: ${Theme.mobileThreshold}) {
    width: 100vw;
    padding: 0;
  }
`;

const LeftPanelBackground = styled.div`
  position: fixed;
  top: 0;
  left: -6rem;
  width: 45rem;
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

  @media screen and (max-width: ${Theme.mobileThreshold}) {
    display: none;
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

  @media screen and (max-width: ${Theme.mobileThreshold}) {
    margin-left: 0;
  }
`;

const MobileModeSelector = styled.div`
  display: none;
  width: 100vw;
  height: max-content;
  flex-direction: row;
  justify-content: center;
  margin: 1rem 0 0;
  flex-shrink: 0;

  @media screen and (max-width: ${Theme.mobileThreshold}) {
    display: flex;
  }
`;

const MobileModeButton = styled.button`
  border: none;
  background-color: transparent;
  padding: 0.5rem;
  margin: 0 1rem;

  & svg {
    color: #fff;
  }

  &:hover,
  &:active,
  &:focus {
    outline: none;

    & svg {
      color: #ccc;
    }
  }
`;
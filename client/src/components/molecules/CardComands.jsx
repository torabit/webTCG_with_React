import React,{ useEffect, useState, useContext, useCallback } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import HandsState from '../State/handsState';
import battleFieldState from '../State/battleFieldState';
import requireCostState from '../State/requireCostState';
import howManyState from '../State/howManyState';
import contentTextState from '../State/contentTextState';
import UserNameContext from '../Context/UserNameContext';
import galleryState from '../State/galleryState';
import searchSortState from '../State/searchSortState';
import cardNameState from '../State/cardNameState';
import displayGiveEnergyState from '../State/displayGiveEnergyState';
import ingameIdState from '../State/ingameIdState';
import benchState from '../State/benchState';
import oppBenchState from '../State/oppBenchState';

const CardComands = (props) => {
    const [superTypeButtonText, setSuperTypeButtonText] = useState('');
    const [tcgFunction, setTcgFunction] = useState('');
    const hands = useRecoilValue(HandsState);
    const battleField = useRecoilValue(battleFieldState);
	const setContentText = useSetRecoilState(contentTextState);
    const setHowMany = useSetRecoilState(howManyState);
    const setRequireCost = useSetRecoilState(requireCostState);
    const setGallery = useSetRecoilState(galleryState);
    const setCardName = useSetRecoilState(cardNameState);
    const setSearchSort = useSetRecoilState(searchSortState);
    const userName = useContext(UserNameContext);
    const setDisplayGiveEnergy = useSetRecoilState(displayGiveEnergyState);
    const setIngameId = useSetRecoilState(ingameIdState);
    const bench = useRecoilValue(benchState);
    const oppBench = useRecoilValue(oppBenchState);
    
    const cardComandsFunc = useCallback(() => {
        let newHands = [...hands];

        switch (props.supertype) {
            case 0:
                setSuperTypeButtonText('????????????????????????');
                setTcgFunction(() => useEnergyCard);
                break;
            case 1:
                if (battleField.length === 0) {
                    setSuperTypeButtonText('?????????????????????');
                    setTcgFunction(() => callToBattleField);
                    break;
                } else {
                    setSuperTypeButtonText('??????????????????');
                    setTcgFunction(() => callToBench);
                    break;
                }
            case 2:
                setSuperTypeButtonText('????????????');
                setTcgFunction(() => useSpellCard);
                break;
            default:
                console.log('nothing');
        }
        
        const callToBattleField = async (ingameId) => {
            window.socket.emit('callToBattleField', { 
                yourId: userName.yourId, 
                oppId: userName.oppId,
                ingameId: ingameId
            });
            props.handleClose();
        }
    
        const callToBench = async (ingameId) => {
            window.socket.emit('callToBench', {
                yourId: userName.yourId, 
                oppId: userName.oppId,
                ingameId: ingameId
            });
            props.handleClose();
        }
    
        const useSpellCard = async (ingameId) => {
            let newYourHands = [...newHands];
            let index = 0;
            for (let i=0; i<newYourHands.length; i++) {
                if(newYourHands[i].ingame_id === ingameId) index = i;
            }
            switch(props.cardName) {
                case '?????????????????????':
                    newYourHands.splice(index, 1);
                    setGallery(newYourHands);
                    setContentText('?????????????????????: ?????????????????????????????????1????????????????????????');
                    setHowMany(1);
                    setIngameId(ingameId);
                    setRequireCost(true);
                    setCardName(props.cardName);
                    break;
                case '??????????????????':
                    newYourHands.splice(index, 1);
                    setGallery(newYourHands);
                    setContentText('??????????????????: ?????????????????????????????????1????????????????????????');
                    setHowMany(1);
                    setIngameId(ingameId);
                    setRequireCost(true);
                    setCardName(props.cardName);
                    setSearchSort(1);
                    break;
                case '????????????????????????':
                    setGallery(bench);
                    setContentText('????????????????????????: ????????????????????????????????????????????????????????????????????????');
                    setHowMany(1);
                    setIngameId(ingameId);
                    setRequireCost(true);
                    setCardName(props.cardName);
                    break;
                case '?????????????????????????????????':
                    setGallery(oppBench);
                    setContentText('???????????????: ?????????????????????????????????1???????????????????????????????????????????????????');
                    setHowMany(1);
                    setIngameId(ingameId);
                    setRequireCost(true);
                    setCardName(props.cardName);
                    break;
                default :
                    window.socket.emit('useSpellCard', {
                        yourId: userName.yourId,
                        oppId: userName.oppId,
                        ingameId: ingameId
                    });
            }
            props.handleClose();
        }
    
        const useEnergyCard = async (ingameId) => {
            setHowMany(1);
            setIngameId(ingameId);
            setDisplayGiveEnergy(true);
            props.handleClose();
        }
    },[
        battleField.length, setContentText, setGallery, 
        props, setHowMany, setDisplayGiveEnergy,
        setRequireCost, setCardName, setSearchSort,
        userName.oppId, userName.yourId, hands,
        setIngameId, bench
    ]);

    useEffect(() => {
        cardComandsFunc();
    },[cardComandsFunc]);

    return(
        <Menu
            id="simple-menu"
            anchorEl={props.anchorEl}
            keepMounted
            open={Boolean(props.anchorEl)}
            onClose={props.handleClose}
        >
            {/* ?????????????????????????????????????????????????????????????????? */}
            <MenuItem onClick={() => tcgFunction(props.ingameId)}>{superTypeButtonText}</MenuItem>
        </Menu>
    );
}

export default CardComands;
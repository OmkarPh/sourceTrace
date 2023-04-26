import styled from "styled-components";

export const Container = styled.div`
    width: 100%;
    height: calc(100vh - 80px);
    display: flex;
    flex-direction: row;
`

export const LeftContainer = styled.div`
    width: 30%;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 50px 15px 25px 30px;
`

export const RightContainer = styled.div`
    width: 70%;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 0px 30px 5px 15px;
`

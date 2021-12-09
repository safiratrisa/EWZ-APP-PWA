import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import Box from "../components/Box";
import Control from "../components/Control/Control";
import GameBoard from "../components/GameBoard";
import ScoreBoard from "../components/ScoreBoard";
import Text from "../components/Text";
import useGameBoard from "../hooks/useGameBoard";
import useGameScore from "../hooks/useGameScore";
import useGameState, { GameStatus } from "../hooks/useGameState";
import useScaleControl from "../hooks/useScaleControl";
import { GRID_SIZE, MIN_SCALE, SPACING } from "../utils/constants";
import useLocalStorage from "../hooks/useLocalStorage";
import { ThemeName } from "../themes/types";
import useTheme from "../hooks/useTheme";
import Nav from "../components/Nav";
import DialogRegister from "../components/DialogRegister";
import { APP_NAME, LS_DATA } from "../constants/config";
import { addListBestScoreSync } from "../worker/utils";

export type Configuration = {
  theme: ThemeName;
  bestScore: number;
  rows: number;
  cols: number;
};

const App: NextPage = () => {
  const [user, setUser] = useState<any>({});
  const [open, setDialog] = useState(false);
  const [{ status: gameStatus, pause }, setGameStatus] = useGameState({
    status: "running",
    pause: false,
  });
  const [config, setConfig] = useLocalStorage<Configuration>(APP_NAME, {
    theme: "default",
    bestScore: 0,
    rows: MIN_SCALE,
    cols: MIN_SCALE,
  });
  const [{ name: themeName, value: themeValue }] = useTheme(config.theme);

  const [rows, setRows] = useScaleControl(config.rows);
  const [cols, setCols] = useScaleControl(config.cols);

  const { total, best, addScore, setTotal } = useGameScore(config.bestScore);

  const { tiles, onMove, onMovePending } = useGameBoard({
    rows,
    cols,
    pause,
    gameStatus,
    setGameStatus,
    addScore,
  });

  const onResetGame = useCallback(() => {
    setGameStatus("restart");
  }, [setGameStatus]);

  const updateScore = async () => {
    try {
      if ("serviceWorker" in navigator && "SyncManager" in window) {
        const body = JSON.stringify({ id: user.id, name: user.name, score: best });
        navigator.serviceWorker.ready.then(function (sw: any) {
          addListBestScoreSync({ id: user.id, name: user.name, score: best });
          sw.sync.register("sync-rangking");
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const onCloseNotification = useCallback(
    (currentStatus: GameStatus) => {
      updateScore();
      setGameStatus(currentStatus === "win" ? "continue" : "restart");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setGameStatus, best, user]
  );

  useEffect(() => {
    if (gameStatus === "restart") setTotal(0);
  }, [gameStatus, setTotal]);

  useEffect(() => {
    setConfig({ rows, cols, bestScore: best, theme: themeName });
  }, [rows, cols, best, themeName, setConfig]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const dataUser = localStorage.getItem(LS_DATA);
    if (!dataUser) setDialog(true);
    else setUser(JSON.parse(dataUser));
  }, [open]);

  return (
    <ThemeProvider theme={themeValue}>
      <Box justifyContent="center" inlineSize="100%" blockSize="100%" alignItems="start" borderRadius={0}>
        <Box justifyContent="center" flexDirection="column" inlineSize={`${GRID_SIZE}px`}>
          <Box inlineSize="100%" justifyContent="space-between" marginBlockStart="s2">
            <Box>
              <Text onClick={() => setGameStatus("lost")} fontSize={64} fontWeight="bold" color="primary">
                EWZ
              </Text>
            </Box>
            <Box justifyContent="center">
              <ScoreBoard total={total} title="score" />
              <ScoreBoard total={best} title="best" />
            </Box>
          </Box>
          <Box marginBlockStart="s2" marginBlockEnd="s6" inlineSize="100%">
            <Control
              user={user}
              rows={rows}
              cols={cols}
              onReset={onResetGame}
              onChangeRow={setRows}
              onChangeCol={setCols}
            />
          </Box>
          <GameBoard
            tiles={tiles}
            boardSize={GRID_SIZE}
            rows={rows}
            cols={cols}
            spacing={SPACING}
            gameStatus={gameStatus}
            onMove={onMove}
            onMovePending={onMovePending}
            onCloseNotification={onCloseNotification}
          />
        </Box>
      </Box>
      <Nav active="game" />
      <DialogRegister open={open} onClose={() => setDialog(false)} />
    </ThemeProvider>
  );
};

export default App;

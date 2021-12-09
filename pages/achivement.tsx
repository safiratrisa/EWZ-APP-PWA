import type { NextPage } from "next";
import { ThemeProvider } from "styled-components";
import Box from "../components/Box";
import Text from "../components/Text";
import { GRID_SIZE, MIN_SCALE } from "../utils/constants";
import { ThemeName } from "../themes/types";
import useTheme from "../hooks/useTheme";
import Nav from "../components/Nav";
import useLocalStorage from "../hooks/useLocalStorage";
import { useEffect, useState } from "react";
import { LS_DATA } from "../constants/config";
import { entries, createStore } from "idb-keyval";
import Head from "next/head";

export type Configuration = {
  theme: ThemeName;
  bestScore: number;
  rows: number;
  cols: number;
};

const APP_NAME = "react-2048";

const Acivment: NextPage = () => {
  const [user, setUser] = useState<any>({});
  const [listRangking, setListRangking] = useState([]);
  const [config] = useLocalStorage<Configuration>(APP_NAME, {
    theme: "default",
    bestScore: 0,
    rows: MIN_SCALE,
    cols: MIN_SCALE,
  });

  const [{ value: themeValue }] = useTheme(config.theme);

  const getListAchivment = async () => {
    try {
      const response = await fetch("/api/list-bestscore", { method: "GET" }).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      });

      setListRangking(response.data);
    } catch (error) {
      const storeRangking = createStore("ewz-pwa", "ranking");
      entries(storeRangking).then((data: any) => {
        setListRangking(data.map(([_, item]: any) => item));
      });
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const dataUser = localStorage.getItem(LS_DATA);
    if (!dataUser) return;

    setUser(JSON.parse(dataUser as string));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getListAchivment();
  }, []);

  return (
    <>
      <Head>
        <title>EWZ PWS Achivment</title>
      </Head>
      <ThemeProvider theme={themeValue}>
        <Box justifyContent="center" inlineSize="100%" blockSize="100%" alignItems="start" borderRadius={0}>
          <Box justifyContent="center" flexDirection="column" inlineSize={`${GRID_SIZE}px`}>
            <Box>
              <Text fontSize={64} fontWeight="bold" color="primary">
                EWZ Score
              </Text>
            </Box>
            <Box flexDirection="column" style={{ marginTop: 20 }}>
              {listRangking.map(({ id, name, score }, index) => {
                return (
                  <Box key={id} style={{ marginBottom: 20, width: "100%" }} justifyContent="space-between">
                    <Box style={{ marginRight: 20 }}>
                      <Text fontSize={14} fontWeight="bold" color="primary">
                        ({index + 1})
                      </Text>
                    </Box>
                    <Box style={{ minWidth: 200 }}>
                      <Text fontSize={14} color={user.id === id ? "tile64" : "primary"}>
                        {name} {user.id === id ? "(you)" : ""}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize={14} fontWeight="bold" color="primary">
                        {score}
                      </Text>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
        <Nav active="achivement" />
      </ThemeProvider>
    </>
  );
};

export default Acivment;

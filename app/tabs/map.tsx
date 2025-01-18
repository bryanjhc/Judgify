import { View, Image, StyleSheet, Platform, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { Button, Container } from 'native-base';
import { db } from '../../db/firebaseConfig';
import { collection, addDoc, doc, setDoc, getDoc, getDocs, query, where, updateDoc, deleteDoc, writeBatch, orderBy } from "firebase/firestore"; // Firestore functions
import React, { useEffect, useState, useMemo } from 'react';
import { Cell } from '@/constants/interfaces';
import { Icon } from 'react-native-elements';
import Svg, { Path } from 'react-native-svg';

export default function HomeScreen() {

    const router = useRouter();

    const [teams, setTeams] = useState<any[]>([]);
    const [assignedTableIds, setAssignedTableIds] = useState<string[]>([]);
    const [gridOutline, setGrid] = useState<Cell[][]>([]);

    //Measuring layout
    const [layoutWidth, setLayoutWidth] = useState(0);
    const [layoutHeight, setLayoutHeight] = useState(0);

    const [startCell, setStartCell] = useState<Cell | null>(null);
    const [overlayEnabled, setOverlayEnabled] = useState(false);


    useEffect(() => {
        const fetchAllTeams = async () => {
            const fetchedTeams = await fetchTeamsFromHacknRoll();
            setTeams(fetchedTeams);
            // For example, we can assign some tables to teams
            setAssignedTableIds(["2", "7", "12"]); // For example, these docIds are "assigned"
        };
        fetchAllTeams();
    }, []);

    async function fetchTeamsFromHacknRoll() {
        try {
            const q = query(
                collection(db, "HacknRoll25"),
                orderBy("ID", "asc")
            );
          const querySnapshot = await getDocs(q);
          const teams: any[] = [];
          querySnapshot.forEach((docSnap) => {
            // docSnap.id is the document ID (string)
            // docSnap.data() is the actual data
            teams.push({
              docId: docSnap.id,       // could store doc ID (string), or use the "ID" field
              ...docSnap.data(),
            });
          });
          console.log("Fetched teams:", teams);
          return teams;
        } catch (error) {
          console.error("Error fetching teams:", error);
          return [];
        }
    }


    //Insert fake info
    const entries = [
        { ID: 1, focus: "most innovative hack", teamName: "InnovateSquad", votes: 6119 },
        { ID: 2, focus: "most practical solution", teamName: "NUSmartDevelopers", votes: 1062 },
        { ID: 3, focus: "best user experience", teamName: "TechNerds", votes: 6577 },
        { ID: 4, focus: "most innovative hack", teamName: "HackathonCreators", votes: 9297 },
        { ID: 5, focus: "most practical solution", teamName: "TechCreators", votes: 6227 },
        { ID: 6, focus: "best design", teamName: "PioneersNerds", votes: 4078 },
        { ID: 7, focus: "best design", teamName: "InnovateMasters", votes: 4217 },
        { ID: 8, focus: "most practical solution", teamName: "CodeNerds", votes: 2859 },
        { ID: 9, focus: "best design", teamName: "BuildersNerds", votes: 3666 },
        { ID: 10, focus: "best design", teamName: "NUSmartMasters", votes: 1365 },
        { ID: 11, focus: "most practical solution", teamName: "PioneersGurus", votes: 1911 },
        { ID: 12, focus: "most practical solution", teamName: "BuildersChamp", votes: 2550 },
        { ID: 13, focus: "best user experience", teamName: "TechChamp", votes: 1273 },
        { ID: 14, focus: "most useless hack", teamName: "HackathonGurus", votes: 5331 },
        { ID: 15, focus: "most practical solution", teamName: "InnovateChamp", votes: 9724 },
        { ID: 16, focus: "most practical solution", teamName: "BuildersNerds", votes: 4498 },
        { ID: 17, focus: "most useless hack", teamName: "HackathonCreators", votes: 6771 },
        { ID: 18, focus: "best user experience", teamName: "PioneersHackers", votes: 9122 },
        { ID: 19, focus: "most practical solution", teamName: "CodeChamp", votes: 494 },
        { ID: 20, focus: "best user experience", teamName: "PioneersSquad", votes: 3928 },
        { ID: 21, focus: "most practical solution", teamName: "TeamGurus", votes: 3284 },
        { ID: 22, focus: "best design", teamName: "TeamHackers", votes: 4732 },
        { ID: 23, focus: "most innovative hack", teamName: "InnovateMasters", votes: 417 },
        { ID: 24, focus: "best design", teamName: "CodeSquad", votes: 3206 },
        { ID: 25, focus: "most practical solution", teamName: "DreamersDevelopers", votes: 6491 },
        { ID: 26, focus: "best design", teamName: "CodeCreators", votes: 459 },
        { ID: 27, focus: "most innovative hack", teamName: "NUSmartHackers", votes: 53 },
        { ID: 28, focus: "most practical solution", teamName: "HackathonDevelopers", votes: 7516 },
        { ID: 29, focus: "best user experience", teamName: "CodeHackers", votes: 5042 },
        { ID: 30, focus: "best user experience", teamName: "NUSmartGurus", votes: 3289 },
        { ID: 31, focus: "most practical solution", teamName: "InnovateDevelopers", votes: 5404 },
        { ID: 32, focus: "best user experience", teamName: "NUSmartSquad", votes: 8646 },
        { ID: 33, focus: "best user experience", teamName: "CodeMasters", votes: 2054 },
        { ID: 34, focus: "best design", teamName: "NUSmartJudge", votes: 9165 },
        { ID: 35, focus: "best user experience", teamName: "InnovateJudge", votes: 601 },
        { ID: 36, focus: "most practical solution", teamName: "InnovateHackers", votes: 3130 },
        { ID: 37, focus: "best design", teamName: "DreamersHackers", votes: 5694 },
        { ID: 38, focus: "best user experience", teamName: "InnovateCreators", votes: 4288 },
        { ID: 39, focus: "best design", teamName: "NUSmartNerds", votes: 4415 },
        { ID: 40, focus: "most useless hack", teamName: "HackathonGurus", votes: 2497 },
        { ID: 41, focus: "most useless hack", teamName: "TeamNerds", votes: 6252 },
        { ID: 42, focus: "best user experience", teamName: "TechNerds", votes: 633 },
        { ID: 43, focus: "best user experience", teamName: "PioneersHackers", votes: 9229 },
        { ID: 44, focus: "most practical solution", teamName: "InnovateGurus", votes: 3704 },
        { ID: 45, focus: "most useless hack", teamName: "BuildersMasters", votes: 3996 },
        { ID: 46, focus: "most practical solution", teamName: "CodeMasters", votes: 3617 },
        { ID: 47, focus: "best design", teamName: "TeamGurus", votes: 3886 },
        { ID: 48, focus: "best user experience", teamName: "CodeMasters", votes: 3663 },
        { ID: 49, focus: "most practical solution", teamName: "TeamMasters", votes: 402 },
        { ID: 50, focus: "best user experience", teamName: "PioneersDevelopers", votes: 7309 },
        { ID: 51, focus: "most innovative hack", teamName: "NUSmartMasters", votes: 3275 },
        { ID: 52, focus: "most useless hack", teamName: "DreamersGurus", votes: 6420 },
        { ID: 53, focus: "most innovative hack", teamName: "TeamDevelopers", votes: 674 },
        { ID: 54, focus: "most innovative hack", teamName: "DreamersSquad", votes: 7930 },
        { ID: 55, focus: "best design", teamName: "NUSmartMasters", votes: 4711 },
        { ID: 56, focus: "most useless hack", teamName: "DreamersMasters", votes: 9188 },
        { ID: 57, focus: "best user experience", teamName: "DreamersChamp", votes: 1530 },
        { ID: 58, focus: "best user experience", teamName: "PioneersHackers", votes: 721 },
        { ID: 59, focus: "most practical solution", teamName: "CodeNerds", votes: 4691 },
        { ID: 60, focus: "best user experience", teamName: "PioneersChamp", votes: 6557 }
    ];

    async function batchInsertEntries() {
        const batch = writeBatch(db);
        const collectionPath = "HacknRoll25";

        entries.forEach((entry) => {
        //   const docRef = doc(db, collectionPath, entry.ID.toString());
        const docRef = doc(db, collectionPath, entry.ID.toString());
          batch.set(docRef, entry);
        });

        try {
          console.log("running the push");
          await batch.commit();
          console.log("Batch insert successful!");
        } catch (error) {
          console.error("Error inserting batch: ", error);
        }
    }


    //Sample layout of event space:
    const rowLayout = ['table', 'table', 'table', 'aisle', 'table', 'table', 'table'];

    //Gonna represent it in a grid format so easier to draw lines
    function buildGrid(teamsArray: any[]) {
        const tablesPerRow = 6;
        const totalTableRows = Math.ceil(teamsArray.length / tablesPerRow);
        const displayRows = 2 * totalTableRows - 1; // includes the inbetween aisles
        const columns = rowLayout.length;

        let tableIndex = 0;
        let grid: Array<Array<any>> = [];

        for (let r = 0; r < displayRows; r++) {
            const isTableRow = (r % 2 === 0); // even row => table row; odd => aisle row
            let rowCells: Array<any> = [];

            for (let c = 0; c < columns; c++) {
                let cellType = 'aisle';
                let team = null;
                if (isTableRow) {
                    cellType = rowLayout[c]; // 'table' or 'aisle'

                    if (cellType === 'table' && tableIndex < teamsArray.length) { // if table assign the team to it too
                    team = teamsArray[tableIndex];
                    tableIndex++;
                    }
                }

                // figure out if walkable (usually only aisle is walkable)
                const walkable = (cellType === 'aisle');

                rowCells.push({
                    row: r,
                    col: c,
                    type: cellType,
                    walkable: walkable,
                    team: team,
                });
            }
          grid.push(rowCells);
        }
        return grid;
    };

    // Build the grid using the teams
    const grid = useMemo(() => {
        return buildGrid(teams);
    }, [teams]);

    const assignedCells = useMemo(() => {
        const result: Cell[] = [];
        for (let r = 0; r < grid.length; r++) {
          for (let c = 0; c < grid[r].length; c++) {
            if (grid[r][c].team && assignedTableIds.includes(grid[r][c].team.docId)) {
              result.push(grid[r][c]);
            }
          }
        }
        return result;
    }, [grid, assignedTableIds]);

    const displayRows = grid.length;
    const columns = displayRows > 0 ? grid[0].length : 0;

    // Handler for overlay taps
    function handleOverlayTap(x: number, y: number) {
        console.log("Overlay tap at:", x, y);
        if (!layoutWidth || !layoutHeight) return; // not measured yet
        if (displayRows === 0 || columns === 0) return;

        const cellWidth = layoutWidth / columns;
        const cellHeight = layoutHeight / displayRows;

        const col = Math.floor(x / cellWidth);
        const row = Math.floor(y / cellHeight);

        if (
            row >= 0 && row < displayRows &&
            col >= 0 && col < columns
        ) {
            const tappedCell = grid[row][col];
            console.log("Tapped cell =>", tappedCell);
            setStartCell(tappedCell);
        } else {
            console.log("Tapped outside the grid boundary.");
        }
    }

    // Calling BFS when startCell changes
    const [pathCells, setPathCells] = useState<Cell[]>([]); // The final BFS path

    useEffect(() => {
        if (!startCell) return;
        if (assignedCells.length === 0) {
          setPathCells([]);
          return;
        }

        // 1) Find closest assigned table
        let closestTableCell: Cell | null = null;
        let closestDist = Infinity;
        for (const assignCell of assignedCells) {
          const dist =
            Math.abs(assignCell.row - startCell.row) +
            Math.abs(assignCell.col - startCell.col);
          if (dist < closestDist) {
            closestDist = dist;
            closestTableCell = assignCell;
          }
        }
        if (!closestTableCell) {
          setPathCells([]);
          return;
        }

        // 2) Aisle neighbors of that table
        const neighbors = getNeighbors(closestTableCell, grid).filter(n => n.walkable);
        if (neighbors.length === 0) {
          setPathCells([]);
          return;
        }

        // 3) BFS => pick shortest path
        let bestPath: Cell[] = [];
        let bestLen = Infinity;
        for (const neighbor of neighbors) {
          const p = bfs(startCell, neighbor, grid);
          if (p.length > 0 && p.length < bestLen) {
            bestLen = p.length;
            bestPath = p;
          }
        }
        setPathCells(bestPath);

    }, [startCell, assignedCells]);

    function bfs(start: Cell, target: Cell, grid: Cell[][]): Cell[] {
        const visited = new Set<string>();
        const queue: Cell[] = [];
        const parentMap = new Map<Cell, Cell | null>();

        queue.push(start);
        visited.add(`${start.row},${start.col}`);
        parentMap.set(start, null);

        while (queue.length > 0) {
          const current = queue.shift()!;
          if (current.row === target.row && current.col === target.col) {
            return buildPath(parentMap, current);
          }
          for (const neighbor of getNeighbors(current, grid)) {
            const key = `${neighbor.row},${neighbor.col}`;
            if (!visited.has(key)) {
              visited.add(key);
              parentMap.set(neighbor, current);
              queue.push(neighbor);
            }
          }
        }
        return [];
    }

    function getNeighbors(cell: Cell, grid: Cell[][]): Cell[] {
        const directions = [
            { dr: -1, dc: 0 }, // up
            { dr: 1, dc: 0 },  // down
            { dr: 0, dc: -1 }, // left
            { dr: 0, dc: 1 },  // right
        ];
        const neighbors: Cell[] = [];
        for (const { dr, dc } of directions) {
            const nr = cell.row + dr;
            const nc = cell.col + dc;
            if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[nr].length) {
            const nCell = grid[nr][nc];
            // only walkable cells (aisle)
            if (nCell.walkable) {
                neighbors.push(nCell);
            }
            }
        }
        return neighbors;
    }

    function buildPath(parentMap: Map<Cell, Cell | null>, end: Cell) {
        const path: Cell[] = [];
        let current: Cell | null = end;
        while (current) {
            path.push(current);
            current = parentMap.get(current) || null;
        }
        return path.reverse();
    }


    function PathOverlay(props: {
        pathCells: Cell[];
        layoutWidth: number;
        layoutHeight: number;
        rows: number;
        cols: number;
        }) {
        const { pathCells, layoutWidth, layoutHeight, rows, cols } = props;
        if (pathCells.length === 0) return null;

        const cellWidth = layoutWidth / cols;
        const cellHeight = layoutHeight / rows;

        let d = '';
        pathCells.forEach((cell, i) => {
            const cx = (cell.col + 0.5) * cellWidth;
            const cy = (cell.row + 0.5) * cellHeight;
            if (i === 0) {
            d = `M${cx},${cy}`;
            } else {
            d += ` L${cx},${cy}`;
            }
        });

        return (
            <Svg
            pointerEvents="none" // so it doesn't block touches
            style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: layoutWidth,
                height: layoutHeight,
            }}
            >
                <Path d={d} stroke="blue" strokeWidth={3} fill="none" />
            </Svg>
        );
    }


    return (
        <ImageBackground
        source={require('@/assets/images/wooden floor.png')}
        style={styles.backgroundImage}
        >
            <Container style={styles.diningHallContainer}>

                {/* Stage */}
                <Container style={styles.stageContainer}>
                <TouchableOpacity
                    style={styles.stage}
                >
                    <ThemedText type="defaultSemiBold">Stage</ThemedText>
                </TouchableOpacity>
                </Container>

                {/* RENDER THE GRID */}
                <Container
                style={styles.allTablesContainer}
                onLayout={(event) => {
                const { width, height } = event.nativeEvent.layout;
                setLayoutWidth(width);
                setLayoutHeight(height);
                }}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        {grid.map((rowCells, r) => (
                        <View
                            key={`row-${r}`}
                            style={styles.tableRowContainer}
                        >
                            {rowCells.map((cell, c) => {
                            let cellStyle = styles.aisle; // default aisle style
                            if (cell.type === 'table') {
                                const isAssigned = cell.team ? assignedTableIds.includes(cell.team.docId) : false;

                                if (cell.team) {
                                    cellStyle = isAssigned ? styles.assignedTable : styles.table;
                                } else {
                                    // table cell with no team
                                    cellStyle = styles.table;
                                }
                            }
                            // check if it's the "startCell" tapped
                            const isTapped = (startCell?.row === r && startCell?.col === c);
                            if (isTapped) {
                                cellStyle = [cellStyle, { borderWidth: 2, borderColor: 'yellow' }];
                            }

                            return (
                                <TouchableOpacity
                                key={`cell-${r}-${c}`}
                                style={cellStyle}
                                onPress={() => {
                                    if (cell.team) {
                                    Alert.alert(
                                        `Team #${cell.team.docId}`,
                                        `Name: ${cell.team.teamName}\nFocus: ${cell.team.focus}\nVotes: ${cell.team.votes}`
                                    );
                                    }
                                }}
                                >
                                {/* Show ID if there's a team */}
                                {cell.team && (
                                    <ThemedText type="defaultSemiBold">
                                    {cell.team.docId}
                                    </ThemedText>
                                )}
                                </TouchableOpacity>
                            );
                            })}
                        </View>
                        ))}
                    </View>
                    {/* Transparent Overlay to capture taps - covers entire container */}
                    <View
                        style={StyleSheet.absoluteFill}
                        pointerEvents={overlayEnabled ? "auto" : "none"}
                        onStartShouldSetResponder={() => true}
                        onResponderRelease={(evt) => {
                            const { locationX, locationY } = evt.nativeEvent;
                            handleOverlayTap(locationX, locationY);
                        }}
                    />
                    <PathOverlay
                        pathCells={pathCells}
                        layoutWidth={layoutWidth}
                        layoutHeight={layoutHeight}
                        rows={grid.length}
                        cols={grid[0]?.length || 0}
                    />
                </Container>
            </Container>
            <TouchableOpacity
                style={styles.circularButton}
                onPress={() => { setOverlayEnabled(!overlayEnabled); setPathCells([]);}}
            >
                <Icon
                    name={overlayEnabled ? "book" : "location"}
                    type="ionicon"
                    color="black"
                    size={30}
                />
            </TouchableOpacity>
        </ImageBackground>

    );
}

const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
    diningHallContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    stageContainer: {
      flex: 2,
    },
    stage: {
      flexDirection: 'row',
      backgroundColor: '#D2B48C',
      height: '30%',
      alignItems: 'center',
      borderRadius: 5,
      justifyContent: 'center',
    },
    /* The parent container for all the rows */
    allTablesContainer: {
      flex: 8,
      justifyContent: 'space-around',
      flexDirection: 'column',
      marginTop: '30%',
      marginBottom: '40%',
    //   marginHorizontal: '1%',
    },
    /* Each row: horizontally arranged */
    tableRowContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
    //   marginVertical: 2,
    },
    table: {
      height: '100%',
      width: '15%',            // was 20%
      backgroundColor: '#654321',
      borderRadius: 5,
    //   margin: 3,               // was 5
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    aisle: {
      height: '100%',
      width: '15%',            // was 20%
    //   margin: 3,               // was 5
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: 'transparent',
      justifyContent: 'center',
    },
    assignedTable: {
      height: '100%',
      width: '15%',            // was 20%
      backgroundColor: 'red',
      borderRadius: 5,
    //   margin: 3,               // was 5
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    circularButton: {
      position: 'absolute',
      bottom: 100,
      right: 5,
      width: 50,
      height: 50,
      borderRadius: 25, // Half of the width/height for a perfect circle
      backgroundColor: '#D2B48C', // Background color
      alignItems: 'center', // Center icon horizontally
      justifyContent: 'center', // Center icon vertically
      elevation: 5, // Shadow for Android
      shadowColor: '#000', // Shadow color for iOS
      shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
      shadowOpacity: 0.3, // Shadow opacity for iOS
      shadowRadius: 3, // Shadow radius for iOS
    },
});
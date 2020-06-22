import React from 'react'

import 'react-vis/dist/style.css';

import {
    XYPlot,
    XAxis,
    YAxis,
    VerticalGridLines,
    HorizontalGridLines,
    HorizontalBarSeries,
    VerticalBarSeries,
    DiscreteColorLegend
    } from 'react-vis';

import moment from 'moment'

import { Hidden, Box , Paper} from '@material-ui/core'
import { ToggleButtonGroup, ToggleButton} from '@material-ui/lab'

import BottomBar from '../Navigation/BottomBar'
import { useSubscription } from '@apollo/react-hooks'

import {GET_ALL_MISSES, GET_DCCMisses, GET_PintMisses} from './Dashboard.config'

import { mdiChartBarStacked } from '@mdi/js';
import { mdiChartBar } from '@mdi/js';

import Icon from '@mdi/react'

export default function Dashboard() {
    const dateWeekAgo = moment().subtract(7, 'day').format("yyyy-MM-DD") 
    
    const { data: misses, loading: missesLoading } = useSubscription(GET_ALL_MISSES, {
        variables: { date: dateWeekAgo }
    });

    const { data: dccmisses, loading: dccmissesLoading } = useSubscription(GET_DCCMisses, {
    variables: { date: dateWeekAgo }
    });

    const { data: pintmisses, loading: pintmissesLoading } = useSubscription(GET_PintMisses, {
    variables: { date: dateWeekAgo }
    });

    let width = document.getElementById('container')?.getBoundingClientRect().width
    const height = misses?.members.length * 50 || 300

    window.onorientationchange = () => {
        width = document.getElementById('container')?.getBoundingClientRect().width
    };

    const DCC = dccmisses?.members.map(member => ({
        x: member.ign,
        y: member.dcc_per_members_aggregate.aggregate.count
    }))


    const pints = pintmisses?.members.map(member => ({
        x: member.ign,
        y: member.pint_per_members_aggregate.aggregate.count
    }))
    const DCCHor = dccmisses?.members.map(member => ({
        y: member.ign,
        x: member.dcc_per_members_aggregate.aggregate.count
    }))


    const pintsHor = pintmisses?.members.map(member => ({
        y: member.ign,
        x: member.pint_per_members_aggregate.aggregate.count
    }))

    const [stacked, setStacked] = React.useState(true);

    const handleStacked = (event, stacked) => {
        setStacked(stacked);
    };

    return (
        <>
            <Box width="100%">
                <Paper>
                    <Box p="16px" pb="0">
                    <ToggleButtonGroup
                        value={stacked}
                        exclusive
                        onChange={handleStacked}
                        aria-label="text alignment"
                        >
                        <ToggleButton value={true} aria-label="left aligned">
                            <Icon
                                path={mdiChartBarStacked}
                                title="Pints"
                                size={1}
                            />
                        </ToggleButton>
                        <ToggleButton value={false} aria-label="centered">
                            <Icon
                                path={mdiChartBar}
                                title="Pints"
                                size={1}
                            />
                        </ToggleButton>
                    </ToggleButtonGroup>
                    </Box>
                    <Box p="16px" pb="0">
                        <DiscreteColorLegend
                            orientation="horizontal"
                            items={[
                                {
                                    title: '  DCC',
                                    color: '#5D0313'
                                },
                                {
                                    title: '  Pints',
                                    color: '#DA7635'
                                }
                                ]}
                            />
                    </Box>
                    <Box p="16px" id="container">

                        <Hidden mdUp> 
                            <XYPlot margin={{left: 100}} yType="ordinal" stackBy={stacked ? 'x' : undefined} width={width  - 32} height={height}>
                                <VerticalGridLines />
                                <HorizontalGridLines />
                                <XAxis tickLabelAngle={-45} tickValues={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}/>
                                <YAxis />
                                <HorizontalBarSeries
                                    color="#5D0313"
                                    data={DCCHor}
                                />
                                <HorizontalBarSeries
                                    color="#DA7635"
                                    data={pintsHor}
                                />
                            </XYPlot>
                        </Hidden>

                        <Hidden smDown> 
                            <XYPlot margin={{bottom: 100}} xType="ordinal" stackBy={stacked ? 'y' : undefined} width={width  - 32} height={height}>
                                <VerticalGridLines />
                                <HorizontalGridLines />
                                <XAxis tickLabelAngle={-45} />
                                <YAxis tickValues={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />
                                <VerticalBarSeries
                                    color="#5D0313"
                                    data={DCC}
                                />
                                <VerticalBarSeries
                                    color="#DA7635"
                                    data={pints}
                                />
                            </XYPlot>
                        </Hidden>
                    </Box>
                </Paper>
            </Box>
            <Hidden smUp> 
                <BottomBar active="dashboard" />
            </Hidden>
        </>
    ) 
}
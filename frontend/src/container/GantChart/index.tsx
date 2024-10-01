import './GantChart.styles.scss';

import { MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { IIntervalUnit } from 'container/TraceDetail/utils';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { TableVirtuoso } from 'react-virtuoso';
import { ITraceTree } from 'types/api/trace/getTraceItem';

import { CardContainer, CardWrapper, CollapseButton } from './styles';
import Trace from './Trace';
import { getFlatData, getMapData, getSpanPath } from './utils';
import { listResponse } from './listResponse';

function GanttChart(props: GanttChartProps): JSX.Element {
	const {
		data,
		traceMetaData,
		activeHoverId,
		setActiveHoverId,
		activeSelectedId,
		setActiveSelectedId,
		spanId,
		// intervalUnit,
	} = props;

	// console.log({ data, traceMetaData, spanId });

	const mapData = listResponse.spans;

	const virtuosoListRender = Object.values(mapData);

	// console.log(mapData);

	const { globalStart, spread: globalSpread } = traceMetaData;

	const [isExpandAll, setIsExpandAll] = useState<boolean>(false);
	const [activeSpanPath, setActiveSpanPath] = useState<string[]>([]);

	useEffect(() => {
		setActiveSpanPath(getSpanPath(data, spanId));
	}, [spanId, data]);

	useEffect(() => {
		setActiveSpanPath(getSpanPath(data, activeSelectedId));
	}, [activeSelectedId, data]);

	const handleCollapse = (): void => {
		setIsExpandAll((prev) => !prev);
	};
	return (
		<CardContainer>
			<CollapseButton
				onClick={handleCollapse}
				title={isExpandAll ? 'Collapse All' : 'Expand All'}
			>
				{isExpandAll ? (
					<MinusSquareOutlined style={{ fontSize: '16px', color: '#08c' }} />
				) : (
					<PlusSquareOutlined style={{ fontSize: '16px', color: '#08c' }} />
				)}
			</CollapseButton>
			<CardWrapper>
				<TableVirtuoso
					className="table-virtuoso"
					style={{ height: '70vh', width: '100%' }}
					totalCount={virtuosoListRender.length}
					// eslint-disable-next-line react/no-unstable-nested-components
					itemContent={(index): JSX.Element => (
						<Trace
							activeHoverId={activeHoverId}
							activeSpanPath={activeSpanPath}
							setActiveHoverId={setActiveHoverId}
							key={virtuosoListRender[index].id}
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...{
								...virtuosoListRender[index],
								globalSpread,
								globalStart,
								setActiveSelectedId,
								activeSelectedId,
							}}
							level={virtuosoListRender[index].level}
							// eslint-disable-next-line react/no-children-prop
							isExpandAll={isExpandAll}
							// intervalUnit={intervalUnit}
						/>
					)}
				/>
				{/* <Trace
					activeHoverId={activeHoverId}
					activeSpanPath={activeSpanPath}
					setActiveHoverId={setActiveHoverId}
					key={data.id}
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...{
						...data,
						globalSpread,
						globalStart,
						setActiveSelectedId,
						activeSelectedId,
					}}
					level={0}
					isExpandAll={isExpandAll}
					intervalUnit={intervalUnit}
				/> */}
			</CardWrapper>
		</CardContainer>
	);
}

export interface ITraceMetaData {
	globalEnd: number;
	globalStart: number;
	levels: number;
	spread: number;
	totalSpans: number;
}

export interface GanttChartProps {
	data: ITraceTree;
	traceMetaData: ITraceMetaData;
	activeSelectedId: string;
	activeHoverId: string;
	setActiveHoverId: Dispatch<SetStateAction<string>>;
	setActiveSelectedId: Dispatch<SetStateAction<string>>;
	spanId: string;
	intervalUnit: IIntervalUnit;
}

export default GanttChart;

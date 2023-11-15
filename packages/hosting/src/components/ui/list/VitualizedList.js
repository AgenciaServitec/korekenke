import React from "react";
import {
  AutoSizer,
  InfiniteLoader,
  List as VList,
  WindowScroller,
} from "react-virtualized";

export const VirtualizedList = ({ dataSource, rowHeight, renderItem }) => {
  const rowRenderer = ({ index, key, style }) => (
    <div key={key} style={style}>
      {renderItem(dataSource[index], index)}
    </div>
  );

  return (
    <WindowScroller>
      {({ height, isScrolling, onChildScroll, scrollTop }) => (
        <InfiniteLoader
          rowCount={dataSource.length}
          threshold={15}
          isRowLoaded={() => false}
          loadMoreRows={async () => console.log("loadMoreRow")}
          minimumBatchSize={10}
        >
          {({ onRowsRendered }) => (
            <AutoSizer disableHeight>
              {({ width }) => (
                <VList
                  autoHeight
                  height={height}
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  overscanRowCount={10}
                  rowCount={dataSource.length}
                  rowHeight={rowHeight}
                  rowRenderer={rowRenderer}
                  onRowsRendered={onRowsRendered}
                  scrollTop={scrollTop}
                  width={width}
                />
              )}
            </AutoSizer>
          )}
        </InfiniteLoader>
      )}
    </WindowScroller>
  );
};

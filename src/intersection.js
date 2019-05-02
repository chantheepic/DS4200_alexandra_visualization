const intersection = d3.select('.svg_skel');

const arrows = d3.selectAll('.svg_arrow');
const trails = d3.selectAll('.svg_arrow_trail');

// MAFN
const mafnIn = d3.select('#svg_arrow_mafn_in');
const mafnOut = d3.select('#svg_arrow_mafn_out');
// MAFS
const mafsIn = d3.select('#svg_arrow_mafs_in');
const mafsOut = d3.select('#svg_arrow_mafs_out');
// WAFE
const wafeIn = d3.select('#svg_arrow_wafe_in');
const wafeOut = d3.select('#svg_arrow_wafe_out');
// WAFW
const wafwIn = d3.select('#svg_arrow_wafw_in');
const wafwOut = d3.select('#svg_arrow_wafw_out');

const ARROWS = [mafnIn, mafnOut, mafsIn, mafsOut, wafeIn, wafeOut, wafwIn, wafwOut];

let DATA = null;

let colorMap = {
  'mafn_in': 1,
  'mafn_out': 1,
  'mafs_in': 1,
  'mafs_out': 1,
  'wafw_in': 1,
  'wafw_out': 1,
  'wafe_in': 1,
  'wafe_out': 1,
};

let currentlySelectedTimeRange = null;

let totalVehicles = 0;

let trafficCountMap = {
  'mafn_in': { total: 0, cars: 0, hv: 0, pab: 0 },
  'mafn_out': { total: 0, cars: 0, hv: 0, pab: 0 },
  'mafs_in': { total: 0, cars: 0, hv: 0, pab: 0 },
  'mafs_out': { total: 0, cars: 0, hv: 0, pab: 0 },
  'wafw_in': { total: 0, cars: 0, hv: 0, pab: 0 },
  'wafw_out': { total: 0, cars: 0, hv: 0, pab: 0 },
  'wafe_in': { total: 0, cars: 0, hv: 0, pab: 0 },
  'wafe_out': { total: 0, cars: 0, hv: 0, pab: 0 }
};

let vehiclesFiltered = ['CARS', 'HV', 'PAB'];

// Create tooltip element, start hidden
let tooltip = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0);
tooltip.append('p').attr('id', 'tooltip-cars');
tooltip.append('p').attr('id', 'tooltip-hv');
tooltip.append('p').attr('id', 'tooltip-pab');
tooltip.append('p').attr('id', 'tooltip-total');
tooltip.append('p').attr('id', 'tooltip-total-on-road');

// Set the data
dispatch.on('dataLoaded.intersection', (data) => {
  if (!DATA) {
    DATA = data;
  }
});

dispatch.on('vehiclesFiltered.intersection', (vehicleTypes) => {
  vehiclesFiltered = vehicleTypes;
});

dispatch.on('updateTime.intersection', (info) => {
  let timeRange = info.timeRange;
  const selectedDirection = info.selectedDirection;
  const idArr = selectedDirection ? selectedDirection.split('_') : null;
  let idOfSelected = idArr ? idArr[2] + '_' + idArr[3] : null;

  // Reset
  totalVehicles = 0;
  for (let property in colorMap) {
    colorMap[property] = 0;
    trafficCountMap[property] = { total: 0, cars: 0, hv: 0, pab: 0 };
  }

  const startArr = timeRange.start.split(':');
  let startHr = startArr[0];

  if (Number(startHr) > 12) {
    startHr -= 12;
  }

  const endArr = timeRange.end.split(':');
  let endHr = endArr[0];

  if (Number(endHr) > 12) {
    endHr -= 12;
  }

  timeRange.start = startHr + ':' + startArr[1];
  timeRange.end = endHr + ':' + endArr[1];

  currentlySelectedTimeRange = timeRange;

  const startDate = new Date('1/1/2019 ' + timeRange.start);
  const endDate = new Date('1/1/2019 ' + timeRange.end);

  // Only one arrow pressed
  DATA.forEach((dataItem) => {
    const date = new Date('1/1/2019 ' + dataItem.hour + ':' + dataItem.minute);

      if (date >= startDate && date <= endDate) {

        if (vehiclesFiltered.includes(dataItem['Type'])) {
          // An arrow was selected
          if (directionSelected && !secondaryDirectionSelected) {

            if (!idOfSelected && firstSelectedID) {
              const idArrOfFirst = firstSelectedID.split('_');
              idOfSelected = idArrOfFirst[2] + '_' + idArrOfFirst[3];
            }

            switch (idOfSelected) {
              case 'mafn_in':
                totalVehicles += (Number(dataItem['MAFN-Thru']) + Number(dataItem['MAFN-Left']) + Number(dataItem['MAFN-Right']));

                trafficCountMap['mafn_in'][dataItem['Type'].toLowerCase()] += (Number(dataItem['MAFN-Thru']) + Number(dataItem['MAFN-Left']) + Number(dataItem['MAFN-Right']));
                trafficCountMap['wafe_out'][dataItem['Type'].toLowerCase()] += Number(dataItem['MAFN-Right']);
                trafficCountMap['mafn_out'][dataItem['Type'].toLowerCase()] += Number(dataItem['MAFN-Thru']);
                trafficCountMap['wafw_out'][dataItem['Type'].toLowerCase()] += Number(dataItem['MAFN-Left']);
                break;
              case 'mafs_in':
                totalVehicles += (Number(dataItem['MAFS-Thru']) + Number(dataItem['MAFS-Left']) + Number(dataItem['MAFS-Right']));

                trafficCountMap['mafs_in'][dataItem['Type'].toLowerCase()] += (Number(dataItem['MAFS-Thru']) + Number(dataItem['MAFS-Left']) + Number(dataItem['MAFS-Right']));
                trafficCountMap['wafw_out'][dataItem['Type'].toLowerCase()] += Number(dataItem['MAFS-Right']);
                trafficCountMap['mafs_out'][dataItem['Type'].toLowerCase()] += Number(dataItem['MAFS-Thru']);
                trafficCountMap['wafe_out'][dataItem['Type'].toLowerCase()] += Number(dataItem['MAFS-Left']);
                break;
              case 'wafw_in':
                totalVehicles += (Number(dataItem['WSW-Thru']) + Number(dataItem['WSW-Left']) + Number(dataItem['WSW-Right']));

                trafficCountMap['wafw_in'][dataItem['Type'].toLowerCase()] += (Number(dataItem['WSW-Thru']) + Number(dataItem['WSW-Left']) + Number(dataItem['WSW-Right']));
                trafficCountMap['mafn_out'][dataItem['Type'].toLowerCase()] += Number(dataItem['WSW-Right']);
                trafficCountMap['wafw_out'][dataItem['Type'].toLowerCase()] += Number(dataItem['WSW-Thru']);
                trafficCountMap['mafs_out'][dataItem['Type'].toLowerCase()] += Number(dataItem['WSW-Left']);
                break;
              case 'wafe_in':
                totalVehicles += (Number(dataItem['WSE-Thru']) + Number(dataItem['WSE-Left']) + Number(dataItem['WSE-Right']));

                trafficCountMap['wafe_in'][dataItem['Type'].toLowerCase()] += (Number(dataItem['WSE-Thru']) + Number(dataItem['WSE-Left']) + Number(dataItem['WSE-Right']));
                trafficCountMap['mafs_out'][dataItem['Type'].toLowerCase()] += Number(dataItem['WSE-Right']);
                trafficCountMap['wafe_out'][dataItem['Type'].toLowerCase()] += Number(dataItem['WSE-Thru']);
                trafficCountMap['mafn_out'][dataItem['Type'].toLowerCase()] += Number(dataItem['WSE-Left']);
                break;
            }
          } else {
            // Add vehicles seen at this time to total vehicles seen in range
            totalVehicles += (Number(dataItem['Int-Total']) - Number(dataItem['MAFN-U-Turn']) - Number(dataItem['MAFS-U-Turn']) - Number(dataItem['WSW-U-Turn']) - Number(dataItem['WSE-U-Turn']));

            // MAFN
            trafficCountMap['mafn_in'][dataItem['Type'].toLowerCase()] += (Number(dataItem['MAFN-Thru']) + Number(dataItem['MAFN-Left']) + Number(dataItem['MAFN-Right']));
            trafficCountMap['mafn_out'][dataItem['Type'].toLowerCase()] += (Number(dataItem['WSE-Left']) + Number(dataItem['WSW-Right']) + Number(dataItem['MAFN-Thru']));

            // MAFS
            trafficCountMap['mafs_in'][dataItem['Type'].toLowerCase()] += (Number(dataItem['MAFS-Thru']) + Number(dataItem['MAFS-Left']) + Number(dataItem['MAFS-Right']));
            trafficCountMap['mafs_out'][dataItem['Type'].toLowerCase()] += (Number(dataItem['WSE-Right']) + Number(dataItem['WSW-Left']) + Number(dataItem['MAFS-Thru']));

            // WAFW
            trafficCountMap['wafw_in'][dataItem['Type'].toLowerCase()] += (Number(dataItem['WSW-Thru']) + Number(dataItem['WSW-Left']) + Number(dataItem['WSW-Right']));
            trafficCountMap['wafw_out'][dataItem['Type'].toLowerCase()] += (Number(dataItem['MAFS-Right']) + Number(dataItem['MAFN-Left']) + Number(dataItem['WSW-Thru']));

            // WAFE
            trafficCountMap['wafe_in'][dataItem['Type'].toLowerCase()] += (Number(dataItem['WSE-Thru']) + Number(dataItem['WSE-Left']) + Number(dataItem['WSE-Right']));
            trafficCountMap['wafe_out'][dataItem['Type'].toLowerCase()] += (Number(dataItem['MAFS-Left']) + Number(dataItem['MAFN-Right']) + Number(dataItem['WSE-Thru']));
          }
        }
      }
    // }
  });


  // MAFN
  trafficCountMap['mafn_in'].total = trafficCountMap['mafn_in'].cars + trafficCountMap['mafn_in'].hv + trafficCountMap['mafn_in'].pab;
  trafficCountMap['mafn_out'].total = trafficCountMap['mafn_out'].cars + trafficCountMap['mafn_out'].hv + trafficCountMap['mafn_out'].pab;

  // MAFS
  trafficCountMap['mafs_in'].total = trafficCountMap['mafs_in'].cars + trafficCountMap['mafs_in'].hv + trafficCountMap['mafs_in'].pab;
  trafficCountMap['mafs_out'].total = trafficCountMap['mafs_out'].cars + trafficCountMap['mafs_out'].hv + trafficCountMap['mafs_out'].pab;

  // WAFW
  trafficCountMap['wafw_in'].total = trafficCountMap['wafw_in'].cars + trafficCountMap['wafw_in'].hv + trafficCountMap['wafw_in'].pab;
  trafficCountMap['wafw_out'].total = trafficCountMap['wafw_out'].cars + trafficCountMap['wafw_out'].hv + trafficCountMap['wafw_out'].pab;

  // WAFE
  trafficCountMap['wafe_in'].total = trafficCountMap['wafe_in'].cars + trafficCountMap['wafe_in'].hv + trafficCountMap['wafe_in'].pab;
  trafficCountMap['wafe_out'].total = trafficCountMap['wafe_out'].cars + trafficCountMap['wafe_out'].hv + trafficCountMap['wafe_out'].pab;

  // MAFN in
  if (!isNaN(trafficCountMap['mafn_in'].total / totalVehicles)) {
    d3.select('#svg_arrow_mafn_in').style('opacity', (trafficCountMap['mafn_in'].total / totalVehicles) * 2);
  }
  // MAFN out
  if (!isNaN(trafficCountMap['mafn_out'].total / totalVehicles)) {
    d3.select('#svg_arrow_mafn_out').style('opacity', (trafficCountMap['mafn_out'].total / totalVehicles) * 2);
  }

  // MAFS in
  if (!isNaN(trafficCountMap['mafs_in'].total / totalVehicles)) {
    d3.select('#svg_arrow_mafs_in').style('opacity', (trafficCountMap['mafs_in'].total / totalVehicles) * 2);
  }
  // MAFS out
  if (!isNaN(trafficCountMap['mafs_out'].total / totalVehicles)) {
    d3.select('#svg_arrow_mafs_out').style('opacity', (trafficCountMap['mafs_out'].total / totalVehicles) * 2);
  }

  // WAFW in
  if (!isNaN(trafficCountMap['wafw_in'].total / totalVehicles)) {
    d3.select('#svg_arrow_wafw_in').style('opacity', (trafficCountMap['wafw_in'].total / totalVehicles) * 2);
  }
  // WAFW out
  if (!isNaN(trafficCountMap['wafw_out'].total / totalVehicles)) {
    d3.select('#svg_arrow_wafw_out').style('opacity', (trafficCountMap['wafw_out'].total / totalVehicles) * 2);
  }

  // WAFE in
  if (!isNaN(trafficCountMap['wafe_in'].total / totalVehicles)) {
    d3.select('#svg_arrow_wafe_in').style('opacity', (trafficCountMap['wafe_in'].total / totalVehicles) * 2);
  }
  // WAFE out
  if (!isNaN(trafficCountMap['wafe_out'].total / totalVehicles)) {
    d3.select('#svg_arrow_wafe_out').style('opacity', (trafficCountMap['wafe_out'].total / totalVehicles) * 2);
  }

  if (idOfSelected) {
    switch (idOfSelected) {
      case 'mafn_in':
        d3.select('#svg_mafn_to_mafn').style('opacity', (trafficCountMap['mafn_out'].total / totalVehicles) * 2);
        d3.select('#svg_mafn_to_wafe').style('opacity', (trafficCountMap['wafe_out'].total / totalVehicles) * 2);
        d3.select('#svg_mafn_to_wafw').style('opacity', (trafficCountMap['wafw_out'].total / totalVehicles) * 2);
        break;
      case 'mafs_in':
        d3.select('#svg_mafs_to_mafs').style('opacity', (trafficCountMap['mafs_out'].total / totalVehicles) * 2);
        d3.select('#svg_mafs_to_wafe').style('opacity', (trafficCountMap['wafe_out'].total / totalVehicles) * 2);
        d3.select('#svg_mafs_to_wafw').style('opacity', (trafficCountMap['wafw_out'].total / totalVehicles) * 2);
        break;
      case 'wafw_in':
        d3.select('#svg_wafw_to_wafw').style('opacity', (trafficCountMap['wafw_out'].total / totalVehicles) * 2);
        d3.select('#svg_wafw_to_mafn').style('opacity', (trafficCountMap['mafn_out'].total / totalVehicles) * 2);
        d3.select('#svg_wafw_to_mafs').style('opacity', (trafficCountMap['mafs_out'].total / totalVehicles) * 2);
        break;
      case 'wafe_in':
        d3.select('#svg_wafe_to_wafe').style('opacity', (trafficCountMap['wafe_out'].total, trafficCountMap['wafe_out'].total / totalVehicles) * 2);
        d3.select('#svg_wafe_to_mafs').style('opacity', (trafficCountMap['mafs_out'].total / totalVehicles) * 2);
        d3.select('#svg_wafe_to_mafn').style('opacity', (trafficCountMap['mafn_out'].total / totalVehicles) * 2);
        break;
    }
  }

});

// To represent an arrow's neighbors
const ARROW_NEIGHBORS = {
  'mafn_in': ['svg_arrow_wafe_out', 'svg_arrow_mafn_out', 'svg_arrow_wafw_out'],
  'wafw_in': ['svg_arrow_mafn_out', 'svg_arrow_wafw_out', 'svg_arrow_mafs_out'],
  'mafs_in': ['svg_arrow_wafw_out', 'svg_arrow_mafs_out', 'svg_arrow_wafe_out'],
  'wafe_in': ['svg_arrow_mafs_out', 'svg_arrow_wafe_out', 'svg_arrow_mafn_out']
};

// To represent an arrow's trails
const ARROW_NEIGHBOR_TRAILS = {
  'mafn_in': ['svg_mafn_to_wafe', 'svg_mafn_to_mafn', 'svg_mafn_to_wafw'],
  'wafw_in': ['svg_wafw_to_mafn', 'svg_wafw_to_wafw', 'svg_wafw_to_mafs'],
  'mafs_in': ['svg_mafs_to_wafw', 'svg_mafs_to_mafs', 'svg_mafs_to_wafe'],
  'wafe_in': ['svg_wafe_to_mafs', 'svg_wafe_to_wafe', 'svg_wafe_to_mafn']
};

// Hide trails initially
trails.style('visibility', 'hidden');

// Variables to tell whether this is the 2nd arrow press
let directionSelected = false;
let secondaryDirectionSelected = false;
let firstSelectedID = '';

// When the intersection is pressed, reset the arrow states
intersection.on('click', () => reset());
// Hover and press for arrows
ARROWS.forEach((arrow) => {
  const id = arrow._groups[0][0].id;

  arrow.on('click', () => onArrowPress(id));
  arrow.on('mouseover', () => onArrowHoverIn(id));
  arrow.on('mouseout', () => onArrowHoverOut(id));
});

// On arrow press
function onArrowPress(id) {

  onArrowHoverOut();

  if ((firstSelectedID && id === firstSelectedID) || secondaryDirectionSelected) {
    reset();
    return;
  }

  const idArr = id.split('_');
  const neighborKey = idArr[2] + '_' + idArr[3];
  let isInbound = idArr[3] === 'in';

  // Outbound : only select the pressed arrow and hide the rest
  if (!isInbound && !directionSelected) {
    arrows._groups[0].forEach((arrow) => {
      if (arrow.id !== id) {
        d3.select('#' + arrow.id).style('visibility', 'hidden');
      }
    });

    directionSelected = true;
    firstSelectedID = id;
    return;
  }

  // Happens when 2nd arrow is pressed, make sure the first arrow was inbound
  if (directionSelected) {
    isInbound = firstSelectedID.split('_')[3] === 'in';
  }

  // Inbound and first arrow selected already, filter trail and arrow to only match 2nd arrow info
  if (directionSelected && isInbound) {
    arrows._groups[0].forEach((arrow) => {
      if (arrow.id !== id && arrow.id !== firstSelectedID) {
        d3.select('#' + arrow.id).style('visibility', 'hidden');
      }
    });

    const trailID = 'svg_' + firstSelectedID.split('_')[2]  + '_to_' + idArr[2];

    trails._groups[0].forEach((trail) => {
      if (trail.id !== trailID) {
        d3.select('#' + trail.id).style('visibility', 'hidden');
      }
    });

    secondaryDirectionSelected = true;
  } else {
    // Hide non-neighbor arrows
    if (ARROW_NEIGHBORS[neighborKey]) {
      const neighborIDs = ARROW_NEIGHBORS[neighborKey];

      arrows._groups[0].forEach((arrow) => {
        if (!neighborIDs.includes(arrow.id)) {
          if (arrow.id !== id) {
            d3.select('#' + arrow.id).style('visibility', 'hidden');
          }
        }
      });
    }

    // Show trails to neighbors
    if (ARROW_NEIGHBOR_TRAILS[neighborKey]) {
      const neighborTrails = ARROW_NEIGHBOR_TRAILS[neighborKey];

      trails._groups[0].forEach((trail) => {
        if (neighborTrails.includes(trail.id)) {
          d3.select('#' + trail.id).style('visibility', 'visible');
        }
      });
    }



    firstSelectedID = id;
    directionSelected = true;

    dispatch.call('updateTime', null, { timeRange: currentlySelectedTimeRange, selectedDirection: id });
  }

  if (isInbound) {
    const idArr = directionSelected ? firstSelectedID.split('_') : id.split('_');
    let fromID = idArr[2].toUpperCase();

    let bound = null;

    if (secondaryDirectionSelected) {
      const toIdArr = id.split('_');

      if (toIdArr[2] === fromID.toLowerCase() && toIdArr[3] === 'out') {
        bound = 'Thru';
      } else {
        if (fromID === 'MAFN') {
          if (toIdArr[2] === 'wafe') {
            bound = 'Right';
          } else if (toIdArr[2] === 'wafw') {
            bound = 'Left';
          }
        } else if (fromID === 'MAFS') {
          if (toIdArr[2] === 'wafw') {
            bound = 'Right';
          } else if (toIdArr[2] === 'wafe') {
            bound = 'Left';
          }
        } else if (fromID === 'WAFW') {
          if (toIdArr[2] === 'mafn') {
            bound = 'Right';
          } else if (toIdArr[2] === 'mafs') {
            bound = 'Left';
          }
        } else if (fromID === 'WAFE') {
          if (toIdArr[2] === 'mafs') {
            bound = 'Right';
          } else if (toIdArr[2] === 'mafn') {
            bound = 'Left';
          }
        }
      }
    }

    if (fromID === 'WAFE') {
      fromID = 'WSE';
    } else if (fromID === 'WAFW') {
      fromID = 'WSW';
    }

    dispatch.call('updateLine', null, { from: fromID, bound: bound });
  }
}

// Reset arrow states
function reset() {
  const e = d3.event;
  const id = e.path[1].id;

  if (id.substring(0, 3).trim() === 'svg' && id !== firstSelectedID) {
    onArrowPress(id);
    return;
  }

  directionSelected = false;
  secondaryDirectionSelected = false;
  firstSelectedID = '';

  arrows._groups[0].forEach((arrow) => {
    d3.select('#' + arrow.id).style('visibility', 'visible');
  });

  trails._groups[0].forEach((trail) => {
    d3.select('#' + trail.id).style('visibility', 'hidden');
  });

  dispatch.call('updateTime', null, { timeRange: currentlySelectedTimeRange, selectedDirection: null });
  dispatch.call('updateLine', null, { from: null, bound: null });
}

// Hover on arrow - show tooltip
function onArrowHoverIn(id) {
  // const id = d3.event.path[1].id;
  const idArr = id.split('_');
  const idForTraffic = idArr[2] + '_' + idArr[3];

  tooltip
    .style('opacity', 0.95)
    .style('left', (d3.event.pageX + 15) + 'px')
    .style('top', (d3.event.pageY + 15) + 'px');

  tooltip.select('#tooltip-cars').text('Cars: ' + trafficCountMap[idForTraffic].cars);
  tooltip.select('#tooltip-hv').text('HV: ' + trafficCountMap[idForTraffic].hv);
  tooltip.select('#tooltip-pab').text('PAB: ' + trafficCountMap[idForTraffic].pab);
  tooltip.select('#tooltip-total').text('Total: ' + trafficCountMap[idForTraffic].total);
  tooltip.select('#tooltip-total-on-road').text('Total vehicles at intersection: ' + totalVehicles);
}

// Hover on arrow - hide tooltip
function onArrowHoverOut(id) {
  tooltip.select('#tooltip-cars').text('');
  tooltip.select('#tooltip-hv').text('');
  tooltip.select('#tooltip-pab').text('');
  tooltip.select('#tooltip-total').text('');
  tooltip.select('#tooltip-total-on-road').text('');
  tooltip.style('opacity', 0);
}

function scaleOpacity(value, in_min, in_max, out_min, out_max) {
  return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

//

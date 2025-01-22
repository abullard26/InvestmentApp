import logo from './logo.svg';
import './App.css';
import {PieChart} from '@mui/x-charts/PieChart'
import { PiePlot, useDrawingArea} from '@mui/x-charts';
import { useState, useEffect } from 'react';
import {styled} from '@mui/material/styles'
import { Divider, List, ListItem, Button, ListItemButton, Collapse, Stack, Tooltip, ListSubheader} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';

function InteractivePieChart({ onItemClick , colors, data}){

  //used to format numbers to dollar values
  let USD = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits:0
  });

  //pie chart properties
  const pieChartProps = {
    margin: {top:10,bottom:10, left:10, right:10},
    series: [
      {
        data: data,
        innerRadius: 70,
        paddingAngle: 1,
        highlightScope: { fade: 'global', highlight: 'item' },
        faded: { additionalRadius: -5 },
      },
    ],
    slotProps: {
      legend: {
        hidden: true,
      }
    },
    width: 400,
    height: 200, 
  };

  //state variable to keep track of highlighted items on piechart
  const [highlightedItem, setHighlightedItem]  = useState(null);

  //rerenders piechart on highlight change
  function handleHighlightChange(event){
    setHighlightedItem(event);
  }

  //total value of all funds
  let tspTotal = 0;
  for(const item of data){
    tspTotal+= item.value;
  }

  return (
    <div style={{ position: 'relative', width: 400, height: 200 }}>
      <PieChart 
        {...pieChartProps}
        onHighlightChange={handleHighlightChange}
        highlightedItem={highlightedItem}
        onItemClick={onItemClick}
        colors={colors}
        tooltip={{trigger:'none'}}
      >
        <PieCenterLabel
         primary={highlightedItem!=null?data[highlightedItem.dataIndex].label:"TSP Total"}
         secondary={highlightedItem!=null?  USD.format(data[highlightedItem.dataIndex].value):USD.format(tspTotal)}
         color = {highlightedItem!=null ? colors[highlightedItem.dataIndex]:'white'}
        >
        </PieCenterLabel>
      </PieChart>
    </div>
  );

}

function PieCenterLabel({primary, secondary, color}) {
  //dimensions of piechart
  const { width, height, left, top } = useDrawingArea();

  //style for centering text
  const StyledText = styled('text')({
    fontWeight: 800,
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontSize: 20,
    color:'white'
  });

  //variables for center of piechart and height and width of rectangle
  const xcenter = left + width / 2;
  const ycenter = top + height / 2;
  const w = 80;
  const h = 30;
  return (  
    <svg>
      <rect rx='10' ry='10' fill={color} width={w} height={h} x={xcenter-w/2} y={ycenter-h/2-10}></rect>
      <StyledText x={xcenter} y={ycenter}>
        <tspan fill={color=='white' ? 'grey':'white'} x={xcenter} dy='-10'>{primary}</tspan>
        <tspan x={xcenter} dy='30'>{secondary}</tspan>
      </StyledText>
    </svg>  
  );
}


function Detail({label, text}){

  return (
    <div style={{
      display:'grid',
      width:'100%',
      position:'relative',
      gridTemplateColumns: '30% 70%',
    }}>
      <div style={{textAlign:'left', color:'grey'}}>{label}</div>
      <div>{text}</div>
    </div>
  );
}

function DetailList({details}){

  const style = {
    m: 2,
    width: '90%',
    maxWidth: 360,
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    backgroundColor: 'background.paper',
    position:'center'
  };

  const listItems = details.map((detail, index, array)=>{
      let divider = <></>;
      if(index!=array.length-1){
        divider = <Divider variant='middle' component='li'/>
      }
      return (
        <>
          <ListItem key={index}>
            <Detail label={detail.label} text={detail.text}/>
          </ListItem>
          {divider}
        </>
      );
    }
  );

  return (
  <List  sx={style}>
    {listItems}
  </List>);

}

function App() {

  let openList = new Array(6).fill(false);
  const [open, setOpen] = useState(openList);

  const [lookThroughSelected, setLookThroughSelected] = useState(false);

  function toggleOpen(toggleIndex){
    let newOpenList = open.map((op,index)=>(toggleIndex==index? !op:op));
    setOpen(newOpenList);
  }

  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (fadeOut) {
      setTimeout(() => {
        setLookThroughSelected(!lookThroughSelected);
        setFadeOut(false); // Reset the fade-out state to allow fade-in
      }, 200); // Timeout matches the duration of the fade-out transition
    }
  }, [fadeOut]);

  const colors = [
    "rgb(4,79,121)",
    "rgb(41,56,82)",
    "rgb(6,113,173)", 
    "rgb(173,197,227)", 
    "rgb(38,38,39)", 
    "rgb(33,184,253)"
  ];
  
  //data displayed for TSP total
  let data = [
    { id: 0, value: 50150, label: 'C Fund'},
    { id: 1, value: 64198, label: 'G Fund'},
    { id: 2, value: 15640, label: 'I Fund'},
    { id: 3, value: 22739, label: 'Y Fund'},
    { id: 4, value: 22739, label: 'S Fund'},
    { id: 5, value: 22739, label: 'F Fund'}
  ];

  //data displayed if look through selected if clicked
  //remove ysf fund and adds money to c g and i
  if(lookThroughSelected){
    let ysfTotal = 0
    for(let i=3; i<data.length;i++){
      ysfTotal += data[i].value;
    }
    data = data.slice(0,3);

    for(const item of data){
      item.value += Math.floor(ysfTotal/3);
    }
  }

  // placeholder details for detaillist
  // could add detail attribute to the objects in data array for customizable details from investment to investment
  const details = [
    {'label':'Risk Level', 'text':'10'},
    {'label':'Examples', 'text':'Apple, Google, Microsoft, Tesla'},
    {'label':'Description', 'text':'Very volatile, will reap the most rewards from good years and the worst losses of bad years'},
  ]

  //money formatiing
  let USD = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits:0
  });

  return (
    <div className="App">
      <Stack direction='row'>
        <button 
        className={lookThroughSelected ? 'off':'on'} 
        onClick={async (event)=>{
          if(lookThroughSelected){
            setFadeOut(true);
          }
        }}
        >
          TSP Holdings
        </button>
        <button
          style={{marginLeft:'auto'}}
          className={lookThroughSelected ? 'on':'off'} 
          onClick={async (event)=>{
            if(!lookThroughSelected){
              setFadeOut(true);
            }
          }}
        >
          Look through Holdings
        </button>
      </Stack>
      <InteractivePieChart 
        data = {data}
        onItemClick = {(event, data)=>(toggleOpen(data.dataIndex))}
        colors={colors}
      />
      <List
        sx={{
          bgcolor:'background.paper', 
          width: '100%' , 
          maxWidth:400,
        }}
        dividers="true"
        className={`${fadeOut ? 'fadeOut':''} ${lookThroughSelected ? 'short':'full'}`}
      >
        <ListSubheader component="div" id="nested-list-subheader">
          <Stack direction='row'>
          <div style={{ fontWeight:'600'}}>
            Items
          </div>
          <div style={{marginLeft:'auto', fontWeight:'600'}}>
            Total Value
          </div>
          </Stack>
        </ListSubheader>
        {data.map((investment, index, array)=>{
          return(
          <div className={` ${open[index] ? 'selected':''}`}key={index}>

            <ListItemButton onClick={()=>{toggleOpen(index)}}>
              
              <Stack>
                <Stack direction='row'>
                  <div className='dropdownlabel' style={{backgroundColor: colors[index]}}>
                    {investment.label}
                  </div>
                  <div style={{marginLeft:'auto'}}> {USD.format(investment.value)}</div>
                  {open[index] ? <ExpandLess className='rotate' />:<ExpandMore className='rotate'/>}
                </Stack>

                <Collapse in={open[index]}>
                <DetailList sx={{p:100}} details={details}/>
                </Collapse>
              </Stack>

            </ListItemButton>
    
            {index<array.length-1 && <Divider variant='middle' component='li'/>}
          </div>);
        })}
        
      </List>
      
    </div>
  );
}

export default App;

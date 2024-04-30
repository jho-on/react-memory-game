
function Card(props){
    return(
        <div className={"card "+props.status} onClick={() => props.clickFunction(props.index)}>
            <img draggable="false" src={props.image}/>
        </div>
    );
}

export default Card;
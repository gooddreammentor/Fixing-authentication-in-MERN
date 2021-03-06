import React from "react";
import PropTypes from "prop-types";
// @material-ui/icons
import Face from "@material-ui/icons/Face";
import TitleIcon from '@material-ui/icons/Title';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
// other component
import { SketchPicker } from 'react-color';
//react component
import SweetAlert from "react-bootstrap-sweetalert";

//image
import defaultImage from "assets/img/default-avatar.png";
//jss
import style from "assets/jss/material-dashboard-pro-react/views/lecture/create.js";
//api
import { course_get } from "Function/Courses.js";
import {lecture_logo_upload, lecture_get, lecture_update} from "Function/Lectures.js";
import {server_url} from "server_host.js";


class LectureEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        file: null,
        imagePreviewUrl: defaultImage,
        imageName: '',
        title: "",
        titleState: "",
        releaseDays: 0,
        deadline: 0,
        weight: 0,
        courseSelect: {},
        courseList: [],
        freeType: '',
        firstColor: '#000',
        secondColor: '#000',
        alert: null,
        levelList: [],
        levelNumber: 1,
        courseId: ''
    };
    this.handleSimple = this.handleSimple.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.logoUpload = this.logoUpload.bind(this);
    this.updateLecture = this.updateLecture.bind(this);
    this.courseSelect = this.courseSelect.bind(this);
    this.freeType = this.freeType.bind(this);
    this.colorChange = this.colorChange.bind(this);
    this.levelSelect = this.levelSelect.bind(this);
    this.backList = this.backList.bind(this);
    
  }
  componentDidMount(){
    var data = {
        id: '0'
    }
    course_get(data).then(res => {
        this.setState({courseList: res});
    })
    .catch(err => {
        console.log(err);
    });
    data = {
        course: 'other',
        id: this.props.match.params.id
    }
    lecture_get(data).then(res => {
        this.setState({
            courseId: res.course_id,
            courseSelect: JSON.stringify({id: res.course_id, title: res.course_name}),
            titleState: 'success',
            imageName: res.lecture_icon,
            title: res.title,
            releaseDays: res.release_date,
            deadline: res.deadline,
            weight: res.weightage,
            imagePreviewUrl: server_url+"lecture/img_get/"+res.lecture_icon,
            freeType: res.free_type,
            firstColor: res.color.first_color,
            secondColor: res.color.second_color,
            levelNumber: res.level_number
        })
        data = {
            id: res.course_id
        }
        course_get(data).then(res => {
            var num_list = [];
            for(var i = 0; i < res.level_number; i++){
                num_list[i] = i;
            }
            this.setState({levelList: num_list});
        })
        .catch(err => {
            console.log(err);
        });
    })
  }
  levelSelect(e) {
    this.setState({levelNumber: e.target.value})
}
  courseSelect(event) {
      this.setState({courseSelect: event.target.value});
  }
  freeType(event) {
      this.setState({freeType: event.target.value})
  }
  // function that verifies if a string has a given length or not
  verifyLength(value, length) {
    if (value.length >= length) {
      return true;
    }
    return false;
  }
  change(event, stateName, type, stateNameEqualTo) {
    switch (type) {
      case "email":
        if (this.verifyEmail(event.target.value)) {
          this.setState({ [stateName + "State"]: "success" });
        } else {
          this.setState({ [stateName + "State"]: "error" });
        }
        break;
      case "length":
        if (this.verifyLength(event.target.value, stateNameEqualTo)) {
          this.setState({ [stateName + "State"]: "success" });
        } else {
          this.setState({ [stateName + "State"]: "error" });
        }
        break;
      default:
        break;
    }
    this.setState({ [stateName]: event.target.value });
  }
  handleImageChange (e) {
    e.preventDefault();
    let reader = new FileReader();
    let newFile = e.target.files[0];
    reader.onloadend = () => {
        this.setState({file: newFile});
        this.setState({imagePreviewUrl: reader.result});
    };
    reader.readAsDataURL(newFile);
  };
  logoUpload() {
    const data = new FormData();
    data.append('file', this.state.file);
    var imgData = {
      imgData: data
    };
    console.log(imgData);
    lecture_logo_upload(imgData).then(res => {
      console.log(res);
      this.setState({imageName: res.filename})
    })
    .catch(err => {
      console.log(err);
    })
  }
  handleSimple(event, stateName) {
      this.setState({[stateName]: event.target.value});
  };
  updateLecture() {
    var data = {
        id: this.props.match.params.id,
        data: {
            course_id: JSON.parse(this.state.courseSelect).id,
            course_name: JSON.parse(this.state.courseSelect).title,
            title: this.state.title,
            release_date: this.state.releaseDays,
            deadline: this.state.deadline,
            weightage: this.state.weight,
            lecture_icon: this.state.imageName,
            free_type: this.state.freeType,
            color: {first_color: this.state.firstColor, second_color: this.state.secondColor},
            level_number: this.state.levelNumber
        }
    }
    lecture_update(data).then(res => {
        const { classes } = this.props;
        if(res.success){
            this.setState({
                alert: <SweetAlert
                success
                style={{ display: "block", marginTop: "-100px" }}
                title="Lecture Edited!"
                onConfirm={() => this.hideAlert()}
                onCancel={() => this.hideAlert()}
                confirmBtnCssClass={classes.button + " " + classes.success}
            />
            })
        }
    })
    .catch(err => {
        console.log(err);
    })
  }
  hideAlert() {
    this.setState({alert: null})
  }
  colorChange(color, flg) {
    if(flg === 'first'){
        this.setState({firstColor: color.hex})
    }
    else {
        this.setState({secondColor: color.hex})
    }
  }
  backList() {
    this.props.history.push('/admin/lectures-list/'+this.state.courseId);
  }
  render() {
    const { classes } = this.props;
    return (
        <>
        {this.state.alert}
      <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
            
          <CardBody>
            {/* <Button color="primary" className={classes.marginRight} onClick={this.backList}>
                Back List
            </Button> */}
          <GridContainer justify="center">
            <GridItem xs={12} sm={12}>
              <h4 className={classes.infoText}>
                Lecture Edit
              </h4>
            </GridItem>
            <GridItem xs={12} sm={4} style={{textAlign: 'center'}}>
                <div className="picture-container">
                    <div className="picture">
                        <img src={this.state.imagePreviewUrl} className="picture-src" alt="..." />
                        <input type="file" onChange={e => this.handleImageChange(e)} />
                    </div>
                    <h6 className="description">Choose Picture</h6>
                </div>
                <Button color="info" className={classes.marginRight} onClick={this.logoUpload} disabled={this.state.file === null ? true : false}>
                  Logo Upload
                </Button>
            </GridItem>
            <GridItem xs={12} sm={6}>
                <FormControl
                    fullWidth
                    className={classes.selectFormControl}
                >
                    <InputLabel
                        htmlFor="simple-select"
                        className={classes.selectLabel}
                    >
                        Select Course
                    </InputLabel>
                    <Select
                        MenuProps={{
                            className: classes.selectMenu
                        }}
                        classes={{
                            select: classes.select
                        }}
                        value={this.state.courseSelect}
                        onChange={this.courseSelect}
                        inputProps={{
                            name: "simpleSelect",
                            id: "simple-select"
                        }}
                    >
                        {this.state.courseList.map(function(item, i){
                            return(
                                <MenuItem
                                    classes={{
                                        root: classes.selectMenuItem,
                                        selected: classes.selectMenuItemSelected
                                    }}
                                    value={JSON.stringify({id: item._id, title: item.title})}
                                    key={i}
                                >
                                    {item.title}
                                </MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
                <FormControl
                    fullWidth
                    className={classes.selectFormControl}
                >
                    <InputLabel
                        htmlFor="simple-select"
                        className={classes.selectLabel}
                    >
                        Select Level Number
                    </InputLabel>
                    <Select
                        MenuProps={{
                            className: classes.selectMenu
                        }}
                        classes={{
                            select: classes.select
                        }}
                        value={this.state.levelNumber}
                        onChange={this.levelSelect}
                        inputProps={{
                            name: "simpleSelect",
                            id: "simple-select"
                        }}
                    >
                        {this.state.levelList.map(function(item, i){
                            return(
                                <MenuItem
                                    classes={{
                                        root: classes.selectMenuItem,
                                        selected: classes.selectMenuItemSelected
                                    }}
                                    value={item+1}
                                    key={i}
                                >
                                    {"Level "+(item+1)}
                                </MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
                <CustomInput
                    success={this.state.titleState === "success"}
                    error={this.state.titleState === "error"}
                    labelText={
                    <span>
                        Title <small>(required)</small>
                    </span>
                    }
                    id="title"
                    formControlProps={{
                        fullWidth: true
                    }}
                    inputProps={{
                        onChange: event => this.change(event, "title", "length", 3),
                        endAdornment: (
                            <InputAdornment
                            position="end"
                            className={classes.inputAdornment}
                            >
                                <TitleIcon className={classes.inputAdornmentIcon} />
                            </InputAdornment>
                        ),
                        value: this.state.title
                    }}
                />
                
            </GridItem>
            <br />
            <br />
            {/* <GridItem xs={12} sm={4}>
                <CustomInput
                    labelText={
                    <span>
                        Release Days <small>(After course is released )</small>
                    </span>
                    }
                    id="remain"
                    formControlProps={{
                        fullWidth: true
                    }}
                    inputProps={{
                        onChange: event => this.change(event, "releaseDays", "length", 0),
                        endAdornment: (
                            <InputAdornment
                                position="end"
                                className={classes.inputAdornment}
                            >
                                <Face className={classes.inputAdornmentIcon} />
                            </InputAdornment>
                        ),
                        type: 'number',
                        value: this.state.releaseDays
                    }}
                />
            </GridItem>
            <GridItem xs={12} sm={4}>
                <CustomInput
                    labelText={
                    <span>
                        Deadline Days <small>(After lecture is released )</small>
                    </span>
                    }
                    id="remain"
                    formControlProps={{
                        fullWidth: true
                    }}
                    inputProps={{
                        onChange: event => this.change(event, "deadline", "length", 0),
                        endAdornment: (
                            <InputAdornment
                                position="end"
                                className={classes.inputAdornment}
                            >
                                <Face className={classes.inputAdornmentIcon} />
                            </InputAdornment>
                        ),
                        type: 'number',
                        value: this.state.deadline
                    }}
                />
            </GridItem> */}
            <GridItem xs={12} sm={6}>
            <FormControl
                    fullWidth
                    className={classes.selectFormControl}
                >
                    <InputLabel
                        htmlFor="simple-select"
                        className={classes.selectLabel}
                    >
                        Pay Type
                    </InputLabel>
                    <Select
                        MenuProps={{
                            className: classes.selectMenu
                        }}
                        classes={{
                            select: classes.select
                        }}
                        value={this.state.freeType}
                        onChange={this.freeType}
                        inputProps={{
                            name: "simpleSelect",
                            id: "simple-select"
                        }}
                    >
                        
                        <MenuItem
                            classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected
                            }}
                            value="pay"
                        >
                            Pay
                        </MenuItem>
                        <MenuItem
                            classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected
                            }}
                            value="free"
                        >
                            Free
                        </MenuItem>
                    </Select>
                </FormControl>
            </GridItem>
            <GridItem xs={12} sm={6}>
                <CustomInput
                    labelText={
                    <span>
                        Weightage <small>(required)</small>
                    </span>
                    }
                    id="remain"
                    formControlProps={{
                        fullWidth: true
                    }}
                    inputProps={{
                        onChange: event => this.change(event, "weight", "length", 0),
                        endAdornment: (
                            <InputAdornment
                                position="end"
                                className={classes.inputAdornment}
                            >
                                <Face className={classes.inputAdornmentIcon} />
                            </InputAdornment>
                        ),
                        type: 'number',
                        value: this.state.weight
                    }}
                />
            </GridItem>
            <GridItem xs={12} sm={4}>
                <SketchPicker
                    color={ this.state.firstColor }
                    onChangeComplete={(color) => this.colorChange(color, 'first') }
                />
            </GridItem>
            <GridItem xs={12} sm={4}>
                <SketchPicker
                    color={ this.state.secondColor }
                    onChangeComplete={(color) => this.colorChange(color, 'second') }
                />
            </GridItem>
            <GridItem xs={12} sm={4}>
                <div 
                    style={{
                        width: '200px', 
                        height: '200px', 
                        background: ('linear-gradient(-143deg,'+this.state.firstColor+' 0,'+this.state.secondColor+' 100%)'),
                        borderRadius: '150px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <img src={this.state.imagePreviewUrl} className="picture-src" alt="..." style={{width:'30px', height: '30px'}}/>
                </div>
            </GridItem>
          </GridContainer>
          <Button 
            color="rose" 
            className={classes.marginRight}
            disabled={(
              this.state.titleState === 'success' &&
              this.state.imageName !== ''
            ) ? false : true}
            onClick={this.updateLecture}
          >
            Upload Lecture
          </Button>
          </CardBody>
          
        </Card>
      </GridItem>
      </GridContainer>
      </>
    );
  }
}

LectureEditor.propTypes = {
  classes: PropTypes.object
};

export default withStyles(style)(LectureEditor);

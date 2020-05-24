import * as React from 'react';
import styles from './MaterialuiStepper.module.scss';
import { IMaterialuiStepperProps } from './IMaterialuiStepperProps';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

export interface IMaterialuiStepperState {
  activeStep: number;
  skipped: any;
}

export default class MaterialuiStepper extends React.Component<IMaterialuiStepperProps, IMaterialuiStepperState> {

  private steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

  private isStepOptional = (step) => {
    return step === 1;
  }

  private isStepSkipped = (step) => {
    return this.state.skipped.has(step);
  }

  /* buttons Section */
  private handleNext = () => {
    const { activeStep } = this.state;
    let { skipped } = this.state;
    if (this.isStepSkipped(activeStep)) {
      skipped = new Set(skipped.values());
      skipped.delete(activeStep);
    }
    this.setState({
      activeStep: activeStep + 1,
      skipped,
    });
  }

  private handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  }

  private handleSkip = () => {
    const { activeStep } = this.state;
    if (!this.isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }
    this.setState(state => {
      const skipped = new Set(state.skipped.values());
      skipped.add(activeStep);
      return {
        activeStep: state.activeStep + 1,
        skipped,
      };
    });
  }

  private handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  }
  /*complete button */

  /* step content*/

  private getStepContent = (step) => {
    switch (step) {
      case 0:
        return 'Select campaign settings...';
      case 1:
        return 'What is an ad group anyways?';
      case 2:
        return 'This is the bit I really care about!';
      default:
        return 'Unknown step';
    }
  }

  /* step content end*/

  public constructor(props: IMaterialuiStepperProps, state: IMaterialuiStepperState) {
    super(props);
    this.state = {
      activeStep: 0,
      skipped: new Set()
    };
  }

  public render(): React.ReactElement<IMaterialuiStepperProps> {
    return (
      <div className={styles.materialuiStepper}>
        <div className={styles.container}>
          <div className={styles.row}>
            <Stepper activeStep={this.state.activeStep}>
              {this.steps.map((label, index) => {
                const props = {};
                const labelProps = {};
                if (this.isStepOptional(index)) {
                  labelProps["optional"] = <Typography variant="caption">Optional</Typography>;
                }
                if (this.isStepSkipped(index)) {
                  props["completed"] = false;
                }
                return (
                  <Step key={label} {...props}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            <div>
              {this.state.activeStep === this.steps.length ? (
                <div>
                  <Typography >
                    All steps completed - you&apos;re finished
                  </Typography>
                  <Button onClick={this.handleReset}>
                    Reset
                  </Button>
                </div>
              ) : (
                  <div>
                    <Typography >{this.getStepContent(this.state.activeStep)}</Typography>
                    <div>
                      <Button disabled={this.state.activeStep === 0} onClick={this.handleBack}>
                        Back
                      </Button>
                      {this.isStepOptional(this.state.activeStep) && (
                        <Button variant="contained" style={{ marginRight: 10 }} color="primary" onClick={this.handleSkip}>
                          Skip
                        </Button>
                      )}
                      <Button variant="contained" color="primary" onClick={this.handleNext}>
                        {this.state.activeStep === this.steps.length - 1 ? 'Finish' : 'Next'}
                      </Button>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

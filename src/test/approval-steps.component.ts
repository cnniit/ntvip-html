import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Approvals} from '../approvals';

@Component({
  selector: 'app-approval-steps',
  templateUrl: './approval-steps.component.html',
  styleUrls: ['./approval-steps.component.less']
})
export class ApprovalStepsComponent implements OnInit{

  @Input()
  approvals : Approvals;
  @Output()
  steps = new EventEmitter<any>();
  @Output()
  totalSteps = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
    if(this.approvals){
      let approval0 = this.approvals;
      let approvali = this.approvals.approveDetails;
      let totalSteps = approvali.length;
      this.totalSteps.emit(totalSteps);
      let steps = []
      //第一个是发起审批人
      steps.push({
        current: 0,
        cName: approval0.createName,
        cTime: approval0.createTime,
      })

      //第二个开始是审批人
      for (let i=0;i<approvali.length;i++){
        steps.push({
          current: i+1,
          aName: approvali[i].approvalName,
          result: approvali[i].approvalResult == 'AGREE'?'同意':'拒绝/撤回',
          status: approvali[i].approvalStatus,    //COMPLETED 完成
        })
      }
      this.steps.emit(steps);
      console.log(this.steps)
    }
  }

  memberApprovalNode(value): any  {
    switch (value) {
      case 'wait':
        return '等待审批';
      case 'process':
        return '审批流转中';
      case 'finish':
        return '此步通过';
      case 'error':
        return '已拒绝';
    }
  };

}

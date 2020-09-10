import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuService } from 'src/app/core/services/menu.service';
import { FormBuilder , FormGroup, } from '@angular/forms';
import { HttpResponseDataStandard } from 'core/base/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NotifyService } from 'src/app/core/services/notify.service';
import { CusNotification } from 'core/base/common';
import { Common } from 'src/app/busi-services/common.service'
import { Location } from '@angular/common';
import { MemberManageService } from 'src/app/busi-services/member-manage.service';
import {Approvals} from '../approvals';

@Component({
  selector: 'app-past-approval-member-data',
  templateUrl: './past-approval-member-data.component.html',
  styleUrls: ['./past-approval-member-data.component.less']
})

export class PastApprovalMemberDataComponent implements OnInit {

  curriculumForm !:FormGroup;
  curriculumData:any[] = [];
  isLoading: Boolean = false;

  filter: { key: string; value: string[] }
  // page: number = 1;
  // limit: number = 10;
  // totalResult: number = 0;
  total = 0;
  pageIndex = 1;
  pageSize = 10;

  id = '';
  flowInstanceId = '';
  approvals : Approvals;
  steps:any = []
  totalSteps = 0;

  constructor(
    private fb: FormBuilder,
    private msg:NzMessageService,
    private menuService:MenuService,
    private notify: NotifyService,
    private commonService: Common,
    @Inject(LOCALE_ID) private locale: string ,
    private location: Location,
    private route: ActivatedRoute,
    private memberManageService: MemberManageService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      this.id = params.get('id')
      this.flowInstanceId = params.get('flowInstanceId')
    })
    this.initForm()
    this.searchData()
    this.notify.schedulePlan.subscribe((res: CusNotification) => {
      if (res.type === 'add-schedule') {
        this.initForm()
        this.searchData()
      }
    });
  }
  initForm(): void {
    this.curriculumForm = this.fb.group({
      coursePacketName: [{ value: '', disabled: true }],
      lessonPlanName: [{ value: '', disabled: true }],
      courseName:[{ value: '', disabled: true }],
    });
  }

  submitForm(): void {
    let data: {key: string, value: string[]};
    let startTime = new Date(this.curriculumForm.value.startTime).getTime();
    let endTime = new Date(this.curriculumForm.value.endTime).getTime();
    if(startTime > endTime && endTime != 0) {
      this.msg.error('结束时间不得小于开始时间')
      return
    }


    if(this.curriculumForm.value.courseName) {
      data = Object.assign({}, data, {courseName: this.curriculumForm.value.courseName.trim() })
    }
    if(this.curriculumForm.value.lessonPlanName) {
      data = Object.assign({}, data, {lessonPlanName: this.curriculumForm.value.lessonPlanName.trim() })
    }
    if(this.curriculumForm.value.courseName) {
      data = Object.assign({}, data, {courseName: this.curriculumForm.value.courseName.trim() })
    }
    if(data) {
      this.filter = data
    }else {
      this.filter = null
    }

    this.searchData(true)

  }


  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.getLessonPlans(this.pageIndex, this.pageSize, this.filter);
  }
  getLessonPlans( page: number, limit: number, filter: any) {
    this.isLoading = true;
    let params = {
      page,
      limit,
      id: this.id,
      flowInstanceId: this.flowInstanceId,
      lessonPlanName: '',
      courseName: '',
      coursePacketName: ''
    }
    if(filter) {
      params = {
        ...params,
        ...filter,
      }
    }
    this.memberManageService.selectLessonPlansDetail(params).subscribe((res:HttpResponseDataStandard) => {
      this.isLoading = false;
      if (res.status !== 200) {
        this.msg.error(res.message);
        return;
      }

      this.curriculumData = res.data.list;
      this.approvals = res.data.instance;

      // if(this.approvals){
      //   let approval0 = this.approvals;
      //   let approvali = this.approvals.approveDetails;
      //   this.totalSteps = approvali.length;
      //
      //   //第一个是发起审批人
      //   this.steps.push({
      //       current: 0,
      //       cName: approval0.createName,
      //       cTime: approval0.createTime,
      //   })
      //
      //   //第二个开始是审批人
      //   for (let i=0;i<approvali.length;i++){
      //       this.steps.push({
      //         current: i+1,
      //         aName: approvali[i].approvalName,
      //         result: approvali[i].approvalResult == 'AGREE'?'同意':'拒绝/撤回',
      //         status: approvali[i].approvalStatus,    //COMPLETED 完成
      //       })
      //   }
      //   console.log(this.steps)
      // }

      this.curriculumForm.patchValue({
        courseName: res.data.courseName,
        lessonPlanName: res.data.lessonPlanName,
        coursePacketName: res.data.coursePacketName
      });

    }, err => {
      this.isLoading = false;
      this.msg.error(JSON.stringify(err));
    })

  }

  // memberApprovalNode(value): any  {
  //   switch (value) {
  //   case 'wait':
  //     return '等待审批';
  //   case 'process':
  //     return '审批流转中';
  //   case 'finish':
  //     return '此步通过';
  //   case 'error':
  //     return '已拒绝';
  //   }
  // };
  // 清空内容
  resetForm(){
    this.curriculumForm.reset()
  }

  goBack() {
    this.location.back();
  }

}

import { PagePresenter } from '../../common/presentation/page.presenter';
import { CoursePresenter } from './course.presenter';

export class CoursePagePresenter extends PagePresenter(CoursePresenter) {}

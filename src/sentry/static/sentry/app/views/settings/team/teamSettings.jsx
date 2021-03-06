import {Box} from 'grid-emotion';
import PropTypes from 'prop-types';
import React from 'react';

import {addErrorMessage, addLoadingMessage} from '../../../actionCreators/indicator';
import {removeTeam} from '../../../actionCreators/teams';
import {t, tct} from '../../../locale';
import AsyncView from '../../asyncView';
import Form from '../components/forms/form';
import JsonForm from '../components/forms/jsonForm';
import TeamModel from './model';
import teamSettingsFields from '../../../data/forms/teamSettingsFields';
import Panel from '../components/panel';
import Field from '../components/forms/field';
import PanelHeader from '../components/panelHeader';
import Button from '../../../components/buttons/button';
import SentryTypes from '../../../proptypes';
import Confirm from '../../../components/confirm';

export default class TeamSettings extends AsyncView {
  static propTypes = {
    ...AsyncView.propTypes,
    team: PropTypes.object.isRequired,
    onTeamChange: PropTypes.func.isRequired,
  };

  static contextTypes = {
    location: PropTypes.object,
    organization: SentryTypes.Organization,
  };

  constructor(props, context) {
    super(props, context);

    this.model = new TeamModel();
    this.model.teamId = props.params.teamId;
    this.model.orgId = props.params.orgId;
  }

  getTitle() {
    return 'Team Settings';
  }

  getEndpoints() {
    return [];
  }

  handleSubmitSuccess = (resp, model, id, change) => {
    if (id === 'slug') {
      addLoadingMessage(t('Slug changed, refreshing page...'));
      window.location.assign(
        `/settings/${this.props.params.orgId}/teams/${model.getValue(id)}/settings/`
      );
      this.props.router.push(
        `/settings/${this.props.params.orgId}/teams/${model.getValue(id)}/settings/`
      );
      this.setState({loading: true});
    }
  };

  handleRemoveTeam = () => {
    removeTeam(this.api, this.props.params).then(data => {
      this.props.router.push(`/settings/${this.props.params.orgId}/teams/`);
    });
  };

  renderBody() {
    let team = this.props.team;

    let access = new Set(this.context.organization.access);

    return (
      <React.Fragment>
        <Form
          model={this.model}
          apiMethod="PUT"
          saveOnBlur
          allowUndo
          onSubmitSuccess={this.handleSubmitSuccess}
          onSubmitError={() => addErrorMessage(t('Unable to save change'))}
          initialData={{
            name: team.name,
            slug: team.slug,
          }}
        >
          <Box>
            <JsonForm location={this.context.location} forms={teamSettingsFields} />
          </Box>
        </Form>

        {access.has('team:admin') && (
          <Panel>
            <PanelHeader>{t('Remove Team')}</PanelHeader>
            <Field
              help={t(
                "This may affect team members' access to projects and associated alert delivery."
              )}
            >
              <div>
                <Confirm
                  onConfirm={this.handleRemoveTeam}
                  priority="danger"
                  message={tct('Are you sure you want to remove the team [team]?', {
                    team: `#${team.slug}`,
                  })}
                >
                  <Button icon="icon-trash" priority="danger" title={t('Remove Team')}>
                    {t('Remove Team')}
                  </Button>
                </Confirm>
              </div>
            </Field>
          </Panel>
        )}
      </React.Fragment>
    );
  }
}

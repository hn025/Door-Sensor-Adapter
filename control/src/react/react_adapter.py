import random
from odin_control.adapters.adapter import (ApiAdapter, ApiAdapterRequest, ApiAdapterResponse,
                                    request_types, response_types)
from odin_control.adapters.parameter_tree import ParameterTree, ParameterTreeError
from odin_control.util import decode_request_body
from tornado.ioloop import PeriodicCallback
import logging

from react.DoorSensor import monitorDoorSensor, hardwareCheck
import threading

class ReactAdapter(ApiAdapter):

    def __init__(self, **kwargs):
        super(ReactAdapter, self).__init__(**kwargs)

        if not hardwareCheck():
            logging.ERROR("Not found.")
            return


        self.currentState = [True]
        self.trueIsOpen = True
        self.param_tree = ParameterTree({
            "currentState" : (lambda: self.currentState[0], None),
            "trueIsOpen" : (lambda: self.trueIsOpen, self.setTrueIsOpen)
        })
        x = threading.Thread(target=monitorDoorSensor, args=(self.currentState,))
        x.start()

    def setTrueIsOpen(self, newValue):
        self.trueIsOpen = newValue

    

    @response_types('application/json', "image/*", default='application/json')
    def get(self, path, request):
        try:
            response = self.param_tree.get(path)
            content_type = 'application/json'
            status = 200
        except ParameterTreeError as param_error:
            response = {'response': 'ZeroRPC GET error: {}'.format(param_error)}
            content_type = 'application/json'
            status = 400

        return ApiAdapterResponse(response, content_type=content_type, status_code=status)

    @response_types('application/json', default='application/json')
    def put(self, path, request):
        try:
            data = decode_request_body(request)
            self.param_tree.set(path, data)

            response = self.param_tree.get(path)
            content_type = 'application/json'
            status = 200

        except ParameterTreeError as param_error:
            response = {'response': 'Cryostat PUT error: {}'.format(param_error)}
            content_type = 'application/json'
            status = 400

        return ApiAdapterResponse(response, content_type=content_type, status_code=status)
